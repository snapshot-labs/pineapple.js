import { ofetch as fetch } from 'ofetch';

const PINEAPPLE_URL = 'https://pineapple.fyi';
const timeout = 10e3;

export async function pin(json: any, url = PINEAPPLE_URL) {
  const init = {
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

  return sendRequest(url, init);
}

export async function upload(body: any, url = `${PINEAPPLE_URL}/upload`) {
  const init = { method: 'POST', body, timeout };

  return sendRequest(url, init);
}

async function sendRequest(url: string, init: any) {
  try {
    return (await fetch(url, init)).result;
  } catch (e: any) {
    return { error: e.data?.error || { code: e.status, message: e.statusText } };
  }
}
