import { getAllSettings } from '@api/preferences';

export const port = 3621;
export const APIURL = `http://localhost:${port}/mac`;
export const SERVERFETCH = `${APIURL}/game/v1`;
export const PLAYERFETCH = `${APIURL}/user/v1`;
export const HISTORYFETCH = `${APIURL}/history/v1`;
export const PLAYERRECORDFETCH = `${APIURL}/playerlist/v1`;
export const PREF_ENDPOINT = `${APIURL}/pref/v1`;
export const USER_ENDPOINT = `${APIURL}/user/v1`;
export const COMMAND_ENDPOINT = `${APIURL}/commands/v1`;
export const KILLFEED_ENDPOINT = `${APIURL}/killfeed/v1`;

// This is used to get fakedata for the frontend.
// dotenv breaks build, so we can't use that.
export const useFakedata = process.env.NODE_ENV?.includes('development');

export async function verifyBackend(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 500);

  return await fetch(SERVERFETCH, { signal: controller.signal })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => clearTimeout(timeoutId));
}

export async function isBackendConfigured(): Promise<boolean> {
  const { steamApiKey, rconPassword } = (await getAllSettings()).internal;

  // We can't have the default values, see them as not configured.
  if (!steamApiKey || steamApiKey === 'YOUR_API_KEY_HERE') return false;
  if (!rconPassword) return false;

  return true;
}
