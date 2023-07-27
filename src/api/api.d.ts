enum profileVisibility {
  Private = 1,
  FriendsOnly = 2,
  Public = 3,
}

interface PlayerInfoRequest {
  steamID64?: string[];
  name?: string[];
}

interface MarkRequest {
  tag: Record<string, string>;
}

interface ServerInfoResponse {
  hostname: string;
  map: string;
  ip: string;
  maxPlayers: number;
  numPlayers: number;
  players: PlayerInfo[];
  gamemode?: GameModeInfo;
}

interface GameInfo {
  userid: string;
  team: number;
  ping: number;
  loss: number;
  state: string;
  kills: number;
  deaths: number;
  time: number;
}

interface SteamInfo {
  name?: string;
  profileUrl?: string;
  pfp?: string;
  pfpHash?: string;
  profileVisibility?: profileVisibility;
  timeCreated?: number;
  countryCode?: string;
  vacBans?: number;
  gameBans?: number;
  daysSinceLastBan?: null | number;
  friends?: SteamFriend[];
}

interface SteamFriend {
  steamID64: number;
  friendsSince: number;
}

interface PlayerInfo {
  name: string;
  gameInfo: GameInfo;
  isSelf: boolean;
  tags?: string[];
  steamID64: string;
  convicted?: boolean;
  localVerdict?: string;
  steamInfo?: SteamInfo;
  customData?: object;
}

interface TeamData {
  RED: PlayerInfo[];
  BLU: PlayerInfo[];
}

interface GameModeInfo {
  matchmaking: boolean;
  game_type: string;
  vanilla: boolean;
}
