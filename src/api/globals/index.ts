export const port = 3621;
export const APIURL = `http://localhost:${port}/mac`;
export const SERVERFETCH = `${APIURL}/game/v1`;
export const PLAYERFETCH = `${APIURL}/user/v1`;
export const MARKPOST = `${APIURL}/mark`;
export const HISTORYFETCH = `${APIURL}/history/v1`;

export const useFakedata = process.env.REACT_APP_USE_FAKEDATA ?? false;

export async function verifyBackend(): Promise<boolean> {
  return await fetch(SERVERFETCH)
    .then((res) => res.ok)
    .catch(() => false);
}
