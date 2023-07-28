import {
  markPlayer,
  fetchAllServerInfo,
  fetchPlayerInfos,
  fetchPlayerHistory,
} from './players';
import { setSetting, getAllSettings } from './preferences';
import { fakedata } from './players/placeholderData';

export const port = 3621;
export const APIURL = `http://localhost:${port}/mac`;
export const SERVERFETCH = `${APIURL}/game/v1`;
export const PLAYERFETCH = `${APIURL}/user/v1`;
export const MARKPOST = `${APIURL}/mark`;
export const HISTORYFETCH = `${APIURL}/history/v1`;

export const useFakedata = process.env.REACT_APP_USE_FAKEDATA ?? false;

export const emptyServerData: ServerInfoResponse = {
  hostname: '',
  ip: '',
  map: '',
  maxPlayers: 32,
  numPlayers: 0,
  players: [],
};

async function verifyBackend(): Promise<boolean> {
  return await fetch(SERVERFETCH)
    .then((res) => res.ok)
    .catch(() => false);
}

export {
  markPlayer,
  fetchAllServerInfo,
  fetchPlayerInfos,
  fetchPlayerHistory,
  setSetting,
  getAllSettings,
  verifyBackend,
  fakedata,
};
