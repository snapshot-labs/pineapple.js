import { ofetch as fetch } from 'ofetch';
import { STATUS_CODE } from './utils';

type Options = { timeout?: number; protocol?: 'ipfs' | 'swarm' };

type RequestParams = {
  method: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
};

const TIMEOUT = 10e3;
const defaultOptions = { retry: 2, retryDelay: 500, retryStatusCodes: [504] };
const PINEAPPLE_URL = 'https://pineapple.fyi';
const DEFAULT_PROTOCOL = 'ipfs';
const AVAILABLE_PROTOCOLS = ['ipfs', 'swarm'];

export function pin(json: any, url = PINEAPPLE_URL, options: Options = {}) {
  const requestParams: RequestParams = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      jsonrpc: '2.0',
      method: 'pin',
      params: json,
      protocol: options.protocol || DEFAULT_PROTOCOL,
      id: null
    },
    timeout: options.timeout ?? TIMEOUT
  };

  return sendRequest(url, requestParams);
}

export function upload(body: any, url = `${PINEAPPLE_URL}/upload`) {
  const requestParams: RequestParams = { method: 'POST', body, timeout: TIMEOUT };

  return sendRequest(url, requestParams);
}

async function sendRequest(url: string, requestParams: RequestParams) {
  if (requestParams.body?.protocol && !AVAILABLE_PROTOCOLS.includes(requestParams.body.protocol)) {
    return Promise.reject({
      error: {
        code: 400,
        message: `Invalid protocol: ${requestParams.body.protocol}.`
      }
    });
  }

  try {
    return (await fetch(url, { ...defaultOptions, ...requestParams })).result;
  } catch (e: any) {
    return Promise.reject({
      error: e.data?.error || {
        code: e.status || 0,
        message: e.statusText || STATUS_CODE[e.status] || 'Network error'
      }
    });
  }
}
