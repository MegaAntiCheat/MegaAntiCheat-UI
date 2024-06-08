import { fakedata } from './fakedata';
import { isDevelopment, SERVERFETCH } from '@api/globals';

const emptyServerData: ServerInfoResponse = {
  hostname: '',
  ip: '',
  map: '',
  maxPlayers: 32,
  numPlayers: 0,
  players: [],
};

async function fetchAllServerInfo(): Promise<ServerInfoResponse> {
  try {
    if (isDevelopment) return fakedata;

    const response = await fetch(SERVERFETCH);

    if (!response.ok) throw new Error('Failed to fetch server information');

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData;
  }
}

export { fetchAllServerInfo, emptyServerData };
