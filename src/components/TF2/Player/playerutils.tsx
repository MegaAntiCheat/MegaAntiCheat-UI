import React from 'react';

import { t } from '@i18n';
import { hexToRGB } from '@api/utils';
import {
  CalendarClock,
  LogIn,
  ScrollText,
  ShieldAlert,
  Star,
  Users2,
} from 'lucide-react';
import { Tooltip } from '@components/General';

const localVerdict = [
  {
    label: 'PLAYER',
    value: 'Player',
  },
  {
    label: 'BOT',
    value: 'Bot',
  },
  {
    label: 'CHEATER',
    value: 'Cheater',
  },
  {
    label: 'SUSPICIOUS',
    value: 'Suspicious',
  },
  {
    label: 'TRUSTED',
    value: 'Trusted',
  },
];

function calculateKD(kills: number = 0, deaths: number = 0): string {
  // No Kills, No KD
  if (!kills) return '0.00';
  // No Deaths but Kills, KD will always be Kills
  if (!deaths) return kills.toFixed(2);
  // Calculate KD
  return (kills / deaths).toFixed(2);
}

function localizeVerdict(verdict: string | undefined) {
  if (!verdict || verdict.toLowerCase() === 'none') return t('PLAYER');

  const option = localVerdict.find((option) => option.value === verdict);

  if (!option) console.error('Invalid verdict: ', verdict);

  return option ? t(option.label.toUpperCase()) : t('PLAYER');
}

function makeLocalizedVerdictOptions() {
  return localVerdict.map((option) => ({
    label: t(option.label.toUpperCase()),
    value: option.value,
  }));
}

function formatTimeToString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function displayProperStatus(status: string) {
  if (status === 'Disconnected') return t('DISCONNECTED');
  if (status === 'Spawning') return t('JOINING');
  return t('IN_GAME');
}

function displayColor(
  playerColors: Record<string, string>,
  player: PlayerInfo,
  cheatersInLobby: PlayerInfo[],
) {
  const ALPHA = '0.35';
  const you = player.isSelf;
  const verdict = player.localVerdict!;

  const { convicted } = player;

  if (you) return hexToRGB(playerColors['You'], ALPHA);

  if (convicted) return hexToRGB(playerColors['Convict'], ALPHA);

  if (!verdict || verdict.includes('None') || verdict.includes('Player')) {
    if (player.tags?.includes('Friend'))
      return hexToRGB(playerColors['Friend'], ALPHA);

    if (hasCheaterFriendsInLobby(player, cheatersInLobby))
      return hexToRGB(playerColors['FriendOfCheater'], ALPHA);

    return hexToRGB(playerColors['Player'], ALPHA);
  }

  return hexToRGB(playerColors[verdict], ALPHA);
}

function getCheaterFriendsInLobby(
  player: PlayerInfo,
  cheatersInLobby: PlayerInfo[],
): PlayerInfo[] {
  return cheatersInLobby.filter(
    (c) => player.friends?.some((f) => f.steamID64 === c.steamID64),
  );
}

function hasCheaterFriendsInLobby(
  player: PlayerInfo,
  cheatersInLobby: PlayerInfo[],
): boolean {
  return cheatersInLobby.some(
    (c) => player.friends?.some((f) => f.steamID64 === c.steamID64),
  );
}

function displayNamesList(player: PlayerInfo): string {
  let nameList = '';

  if (player.previousNames?.length)
    nameList += `${t('TOOLTIP_PREVIOUS_NAME')}\n\n${player.previousNames.join(
      '\n',
    )}`;

  return nameList;
}

function buildPlayerNote(customData: CustomData) {
  let note = '';
  if (customData.tfbd) note += `TFBD: ${customData.tfbd.join(', ')}\n`;
  if (customData.playerNote) note += `${customData.playerNote}\n`;
  return note;
}

function buildIconList(
  player: PlayerInfo,
  cheatersInLobby: PlayerInfo[],
): React.ReactNode[] {
  const now = Date.now() / 1000;
  const hasAlias = !!player.customData?.alias;
  const playerNote = player.customData?.playerNote;
  const tfbd = player.customData?.tfbd;
  const accCreationTime = player.steamInfo?.timeCreated ?? 0;
  const daysOld = (now - accCreationTime) / (24 * 60 * 60);
  const hasBans =
    (player.steamInfo?.gameBans ?? 0) + (player.steamInfo?.vacBans ?? 0);
  const cheaterFriendsInLobby = getCheaterFriendsInLobby(
    player,
    cheatersInLobby,
  );
  const joining = player.gameInfo.state === 'Spawning';
  const kiwi_source =
    player.gameInfo.state === 'Disconnected'
      ? './kiwi_gray.webp'
      : player.gameInfo.team === 2
      ? './kiwi_red.webp'
      : player.gameInfo.team === 3
      ? './kiwi_blue.webp'
      : './kiwi_white.webp';

  return [
    hasAlias && (
      <Tooltip
        key="alias"
        className="mr-1"
        direction="left"
        content={`${t('TOOLTIP_ACTUAL_NAME')}\n${player.name}`}
      >
        <Star width={18} height={18} />
      </Tooltip>
    ),
    (!!playerNote || !!tfbd) && (
      <Tooltip
        className="mr-1"
        key="playernote"
        direction="left"
        content={buildPlayerNote(player.customData)}
      >
        <ScrollText width={18} height={18} />
      </Tooltip>
    ),
    daysOld < 60 && ( // 2 Months
      <Tooltip
        key="age"
        className="mr-1"
        direction="left"
        content={t('TOOLTIP_NEW_ACCOUNT').replace('%1%', daysOld.toFixed(0))}
      >
        <CalendarClock width={18} height={18} />
      </Tooltip>
    ),
    !!hasBans && (
      <Tooltip
        key="hasbans"
        className="mr-1"
        direction="left"
        content={`${player.steamInfo?.vacBans ?? 0} ${t('TOOLTIP_BANS_VAC')}\n${
          player.steamInfo?.gameBans ?? 0
        } ${t('TOOLTIP_BANS_GAME')}\n${
          player.steamInfo?.daysSinceLastBan ?? 0
        } ${t('TOOLTIP_BANS_DAYS')}`}
      >
        <ShieldAlert width={18} height={18} />
      </Tooltip>
    ),
    !!cheaterFriendsInLobby?.length && (
      <Tooltip
        key="cheaterfriends"
        className="mr-1"
        direction="left"
        content={`${t('TOOLTIP_FRIENDS_WITH_CHEATERS')}\n${cheaterFriendsInLobby
          .map((cf) => cf.name)
          .join('\n')}`}
      >
        <Users2 width={18} height={18} />
      </Tooltip>
    ),
    joining && (
      <Tooltip
        key="joining"
        className="mr-1"
        direction="left"
        content={`${t('TOOLTIP_JOINING')}`}
      >
        <LogIn width={18} height={18} />
      </Tooltip>
    ),
    // A special hardcode for me (Youtuber privilege)
    // Added a check for the name including "megascatterbomb" in case I wish to alias.
    // TODO: Remove when MasterBase can determine custom tags (don't want to hardcode for anyone
    // else until they have the ability to toggle their icons on/off without doing a code change)
    player.steamID64 === '76561198022053157' &&
      player.name.toLowerCase().includes('megascatterbomb') && (
        <Tooltip
          key="megascatterbomb"
          className="mr-1"
          direction="left"
          content={`${t('TOOLTIP_MEGASCATTERBOMB_REAL')}`}
        >
          <img height={18} width={18} src={kiwi_source} />
        </Tooltip>
      ),
  ];
}

export {
  localizeVerdict,
  formatTimeToString,
  displayProperStatus,
  displayColor,
  makeLocalizedVerdictOptions,
  calculateKD,
  displayNamesList,
  buildIconList,
};
