const port = 3621
const APIURL = `http://localhost:${port}/mac`;
const SERVERFETCH = `${APIURL}/game/v1`;
const PLAYERFETCH = `${APIURL}/user/v1`
const MARKPOST = `${APIURL}/mark`
const HISTORYFETCH = `${APIURL}/history/v1`

import { emptyServerData } from "..";

async function markPlayer(steamID64: string, verdict: string) {
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ steamID64, verdict }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    console.log(`Marking Player: ${steamID64} with verdict: ${verdict}`);

    const response = await fetch(MARKPOST, options);

    if (!response.ok) throw new Error("Failed to mark player.")
  } catch (e) {
    console.error(e);
  }
}


async function fetchPlayerInfos({ steamID64, name }: PlayerInfoRequest): Promise<PlayerInfo[]> {
  try {
    const options = {
      method: "POST",
      body: JSON.stringify({ steamID64 }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    const response = await fetch(PLAYERFETCH, options);

    if (!response.ok) throw new Error("Failed to fetch player info");

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData.players;
  }
}

async function fetchPlayerHistory(amount: number = 100, startfrom: number = 0): Promise<PlayerInfo[]> {
  try {
    const response = await fetch(`${HISTORYFETCH}?from=${startfrom}&to=${startfrom + amount}`);

    if (!response.ok) throw new Error("Failed to fetch player history");

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData.players;
  }
}


async function fetchAllServerInfo(): Promise<ServerInfoResponse> {
  try {
    const response = await fetch(SERVERFETCH);

    if (!response.ok) throw new Error("Failed to fetch server information");

    return response.json();
  } catch (e) {
    console.error(e);
    return emptyServerData;
  }
}

export {
  fetchPlayerInfos,
  fetchAllServerInfo,
  fetchPlayerHistory,
  markPlayer
}