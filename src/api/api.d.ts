interface PlayerInfoRequest {
  steamID64?: string[],
  name?: string[]
}

interface PlayerInfoResponse {
  players: PlayerInfo[]
}

interface MarkRequest {
  tag: Record<string, string>
}

interface ServerInfoResponse {
  hostname: string,
  map: string,
  ip: string,
  maxPlayers: number,
  numPlayers: number
  players: PlayerInfo[]
}

interface GameInfo {
  userid?: string,
  team?: number,
  ping?: number,
  loss?: number,
  state?: string,
  kills?: number,
  deaths?: number
}


interface PlayerInfo {
  name: string,
  gameInfo?: GameInfo,
  isSelf: boolean,
  tags?: string[],
  steamID64: string
}

interface TeamData {
  RED: PlayerInfo[],
  BLU: PlayerInfo[]
}
