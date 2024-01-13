interface Settings {
  external: {
    language?: string;
    openInApp?: boolean;
    colors?: {
      You: string;
      Player: string;
      Friend: string;
      Trusted: string;
      Suspicious: string;
      FriendOfCheater: string;
      Cheater: string;
      Convict: string;
      Bot: string;
    };
  };
  internal: {
    steamApiKey?: string;
    rconPassword?: string;
    friendsApiUsage?: string;
  };
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
  lastSeen: number;
}

interface SteamInfo {
  name?: string;
  profileUrl?: string;
  pfp?: string;
  pfpHash?: string;
  profileVisibility?: 'Public' | 'Private' | 'Friends Only' | 'Unknown';
  timeCreated?: number;
  countryCode?: string;
  vacBans?: number;
  gameBans?: number;
  daysSinceLastBan?: null | number;
}

interface SteamFriend {
  steamID64: string;
  friendsSince: string;
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
  customData: CustomData;
  previousNames?: string[];
  friends?: SteamFriend[];
  friendsIsPublic?: boolean;
}

interface CustomData {
  alias?: string;
  playerNote?: string;
  tfbd?: string[];
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
