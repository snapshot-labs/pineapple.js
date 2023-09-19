import { ofetch as fetch } from 'ofetch';

const PINEAPPLE_URL = 'https://pineapple.fyi';
const timeout = 10e3;

export function pin(json: any, url = PINEAPPLE_URL) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      jsonrpc: '2.0',
      method: 'pin',
      params: json,
      id: null
    },
    timeout
  };

  return sendRequest(url, options);
}

export function upload(body: any, url = `${PINEAPPLE_URL}/upload`) {
  const options = { method: 'POST', body, timeout };

  return sendRequest(url, options);
}

async function sendRequest(url: string, options: any) {
  try {
    return (await fetch(url, options)).result;
  } catch (e: any) {
    return Promise.reject({ error: e.data?.error || { code: e.status, message: e.statusText } });
  }
}
