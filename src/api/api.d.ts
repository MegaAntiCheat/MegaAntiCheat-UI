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
    dumbAutokick?: boolean;
    masterbaseKey?: string;
    masterbaseHost?: string;
    rconPort?: string;
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
  state: 'Active' | 'Spawning' | 'Disconnected';
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
  fetched?: string;
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

interface ArchivePlayerInfo {
  name: string;
  isSelf: boolean;
  tags?: string[];
  steamID64: string;
  convicted?: boolean;
  localVerdict?: string;
  steamInfo?: SteamInfo;
  customData: CustomData;
  previousNames?: string[];
  friends: SteamFriend[];
  friendsIsPublic?: boolean;
  searchRelevance?: string;
  modified?: string;
  created?: string;
  lastSeen?: string;
}

interface CustomData {
  alias?: string;
  playerNote?: string;
  tfbd?: string[];
}

interface GameModeInfo {
  matchmaking: boolean;
  game_type: string;
  vanilla: boolean;
}
