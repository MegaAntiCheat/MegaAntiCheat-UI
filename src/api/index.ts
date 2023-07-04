const APIURL = "http://localhost:3000/mac";
const SERVERFETCH = `${APIURL}/game/v1`;
const PLAYERFETCH = `${APIURL}/user/v1`
const MARKPOST = `${APIURL}/mark`

import { emptyData, fakedata } from "./fakeData";


async function markPlayer(steamID64: string, verdict: string) {
  try {
    const req = new XMLHttpRequest();
    req.open("POST", MARKPOST, true);
    req.setRequestHeader("Content-Type", "application/json")

    const body = {
      steamID64,
      verdict
    };

    req.send(JSON.stringify(body));
  } catch (e) {
    console.error(e);
  }
}


async function fetchPlayerInfo({ steamID64, name }: PlayerInfoRequest): Promise<PlayerInfoResponse> {
  try {
    const data = await fetch(PLAYERFETCH);

    if (!data || !data.ok) return emptyData;

    return data.json();
  } catch (e) {
    console.error(e)
    return emptyData
  }
}


async function fetchAllServerInfo(): Promise<ServerInfoResponse> {
  try {
    return fakedata;
    //const data = (await fetch(SERVERFETCH));

    //if (!data || !data.ok) return false;

    //return data.json();
  } catch (e) {
    console.error(e)
    return emptyData;
  }
}

export {
  //fetchAllPlayerInfo,
  fetchAllServerInfo,
  markPlayer
}