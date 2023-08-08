import fetch from 'cross-fetch';

const PINEAPPLE_URL = 'https://pineapple.fyi';

export async function pin(json: any, url: string = PINEAPPLE_URL) {
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
  const res = await fetch(url, init);
  const content = await res.json();
  return content.result || content.error;
}

export async function upload(body: any, url = `${PINEAPPLE_URL}/upload`) {
  const init = { method: 'POST', body };
  const res = await fetch(url, init);
  const content = await res.json();
  return content.result || content.error;
}
