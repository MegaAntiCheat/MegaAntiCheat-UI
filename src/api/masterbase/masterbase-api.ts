import { backendUrl, provisionParam } from '@api/masterbase/constants';

async function fetchMasterbase<T>(
  endpoint: string,
  body?: BodyInit,
  options: RequestInit = {},
): Promise<T | string> {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });
  options.headers = headers;
  options.body = body;
  const data: Response = await fetch(`${backendUrl}${endpoint}`, options);
  if (headers.get('Content-Type') === 'text/plain') return await data.text();
  return await data.json();
}

export function status() {
  return fetchMasterbase('', undefined, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
export function provisionUrl() {
  return `${backendUrl}provision`;
}

export function readProvisionKey() {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get(provisionParam);
  if (key) {
    urlParams.delete(provisionParam);
    window.history.replaceState({}, '', `${window.location.pathname}`);
    return key;
  }
  return '';
}
