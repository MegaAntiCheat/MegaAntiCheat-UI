import {
  HISTORYFETCH,
  PLAYERFETCH,
  PLAYERRECORDFETCH,
  useFakedata,
  USER_ENDPOINT,
} from '@api/globals';
import { fakedata } from '@api/servers/fakedata';
import { emptyServerData } from '@api/servers';

interface UpdatePlayerForm {
  [key: string]: UpdatePlayerBody;
}

interface UpdatePlayerBody {
  localVerdict?: string;
  customData?: Record<string, unknown>;
}

async function updatePlayer(
  steamID64: string,
  verdict?: string,
  customData?: Record<string, unknown>,
) {
  try {
    const formBody: UpdatePlayerForm = {
      [steamID64]: {},
    };

    if (verdict) formBody[steamID64].localVerdict = verdict;
    if (customData) formBody[steamID64].customData = customData;

    const options = {
      method: 'PUT',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log(`Marking Player: ${steamID64} with verdict: ${verdict}`);

    const response = await fetch(USER_ENDPOINT, options);

    if (!response.ok) throw new Error('Failed to mark player.');

    return 1;
  } catch (e) {
    return 0;
  }
}

async function fetchPlayerInfos({
  steamID64,
}: PlayerInfoRequest): Promise<PlayerInfo[]> {
  try {
    if (useFakedata) return fakedata.players;

    const options = {
      method: 'PUT',
      body: JSON.stringify({ steamID64 }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(PLAYERFETCH, options);

    if (!response.ok) throw new Error('Failed to fetch player info');

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData.players;
  }
}

async function fetchRecentPlayers(
  amount: number = 100,
  startfrom: number = 0,
): Promise<PlayerInfo[]> {
  try {
    if (useFakedata) return fakedata.players;

    const response = await fetch(
      `${HISTORYFETCH}?from=${startfrom}&to=${startfrom + amount}`,
    );

    if (!response.ok) throw new Error('Failed to fetch player history');

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData.players;
  }
}

async function fetchArchivedPlayers(): Promise<PlayerInfo[]> {
  try {
    if (useFakedata) return fakedata.players;

    const response = await fetch(
      `${PLAYERRECORDFETCH}`,
    );

    if (!response.ok) throw new Error('Failed to fetch player records');

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData.players;
  }
}
export { fetchPlayerInfos, fetchRecentPlayers, fetchArchivedPlayers, updatePlayer };
