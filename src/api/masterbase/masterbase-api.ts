import { backendUrl, provisionParam } from '@api/masterbase/constants';
import { setSettingKey } from '@api/preferences';

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
    setProvisionKey(key);
    return key;
  }
  return '';
}

function setProvisionKey(key: string) {
  void setSettingKey('masterbaseKey', key, 'internal');
}
