import { ofetch as fetch } from 'ofetch';

const PINEAPPLE_URL = 'https://pineapple.fyi';

export async function pin(json: any, url = PINEAPPLE_URL) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'pin',
      params: json,
      id: null
    })
  };

  return sendRequest(url, init);
}

export async function upload(body: any, url = `${PINEAPPLE_URL}/upload`) {
  const init = { method: 'POST', body };

  return sendRequest(url, init);
}

async function sendRequest(url: string, init: any) {
  try {
    return (await fetch(url, init)).result;
  } catch (e: any) {
    return { error: e.data?.error || e };
  }
}
