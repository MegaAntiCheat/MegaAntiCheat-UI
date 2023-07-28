import {
  emptyServerData,
  fakedata,
  SERVERFETCH,
  PLAYERFETCH,
  MARKPOST,
  HISTORYFETCH,
  useFakedata,
} from '@api';

async function markPlayer(steamID64: string, verdict: string) {
  try {
    const options = {
      method: 'POST',
      body: JSON.stringify({ steamID64, verdict }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log(`Marking Player: ${steamID64} with verdict: ${verdict}`);

    const response = await fetch(MARKPOST, options);

    if (!response.ok) throw new Error('Failed to mark player.');
  } catch (e) {
    console.error(e);
  }
}

async function fetchPlayerInfos({
  steamID64,
}: PlayerInfoRequest): Promise<PlayerInfo[]> {
  try {
    if (useFakedata) return fakedata.players;

    const options = {
      method: 'POST',
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

async function fetchPlayerHistory(
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

async function fetchAllServerInfo(): Promise<ServerInfoResponse> {
  try {
    if (useFakedata) return fakedata;

    const response = await fetch(SERVERFETCH);

    if (!response.ok) throw new Error('Failed to fetch server information');

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData;
  }
}

export { fetchPlayerInfos, fetchAllServerInfo, fetchPlayerHistory, markPlayer };
