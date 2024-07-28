import React from 'react';

import { t } from '@i18n';
import { hexToRGB } from '@api/utils';
import {
  CalendarClock,
  LogIn,
  RotateCw,
  ScrollText,
  ShieldAlert,
  Star,
  Users2,
} from 'lucide-react';
import { Tooltip } from '@components/General';
import { updateSteamInfo } from '@api/players';

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

function displayColor<T extends PlayerInfo | ArchivePlayerInfo>(
  playerColors: Record<string, string>,
  player: T,
  cheatersInLobby: T[],
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

function getCheaterFriendsInLobby<T extends PlayerInfo | ArchivePlayerInfo>(
  player: T,
  cheatersInLobby: T[],
): T[] {
  return cheatersInLobby.filter(
    (c) => player.friends?.some((f) => f.steamID64 === c.steamID64),
  );
}

function hasCheaterFriendsInLobby<T extends PlayerInfo | ArchivePlayerInfo>(
  player: T,
  cheatersInLobby: T[],
): boolean {
  return cheatersInLobby.some(
    (c) => player.friends?.some((f) => f.steamID64 === c.steamID64),
  );
}

function displayNamesList(player: PlayerInfo | ArchivePlayerInfo): string {
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
      : player.gameInfo.team === 0
      ? './kiwi_unassigned.webp'
      : player.gameInfo.team === 1
      ? './kiwi_spectator.webp'
      : player.gameInfo.team === 2
      ? './kiwi_red.webp'
      : player.gameInfo.team === 3
      ? './kiwi_blue.webp'
      : './kiwi_white.webp';

  return [
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
    // Add a star if this player has a custom alias set by the user
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
    // Add a note icon if the player has custom notes attached or imported data from TF2BD
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
    // Add an icon if their account is young
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
    // Add an icon if the player has any VAC or Game bans
    !!hasBans && (
      <Tooltip
        key="hasbans"
        className="mr-1"
        direction="left"
        content={
          `${t('TOOLTIP_BANS_VAC').replace(
            '%1%',
            player.steamInfo?.vacBans?.toFixed(0) ?? '0',
          )}\n` +
          `${t('TOOLTIP_BANS_GAME').replace(
            '%1%',
            player.steamInfo?.gameBans?.toFixed(0) ?? '0',
          )}\n` +
          `${t('TOOLTIP_BANS_DAYS').replace(
            '%1%',
            player.steamInfo?.daysSinceLastBan?.toFixed(0) ?? '0',
          )}`
        }
      >
        <ShieldAlert width={18} height={18} />
      </Tooltip>
    ),
    // Highlight players who have cheater friends in the same lobby
    !!cheaterFriendsInLobby?.length && (
      <Tooltip
        key="cheaterfriends"
        className="mr-1"
        direction="left"
        content={`${t('TOOLTIP_FRIENDS_WITH_CHEATERS')}\n${cheaterFriendsInLobby
          .map((cf) => cf.name || cf.steamID64)
          .join('\n')}`}
      >
        <Users2 width={18} height={18} />
      </Tooltip>
    ),
    // Indicate if the player is still connecting to the server
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
  ];
}

function buildIconListFromArchive(
  player: ArchivePlayerInfo,
  cheatersInLobby: ArchivePlayerInfo[],
  isRefreshing: boolean,
  setRefreshing: (b: boolean) => void,
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

  let stale = false;

  const fetchedDate = player.steamInfo?.fetched
    ? new Date(player.steamInfo?.fetched)
    : null;
  if (
    !fetchedDate ||
    Date.now() - fetchedDate.valueOf() > 24 * 60 * 60 * 1000
  ) {
    stale = true;
  }

  const kiwi_source = './kiwi_white.webp';

  return [
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
    // Add a star if this player has a custom alias set by the user
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
    // Add a note icon if the player has custom notes attached or imported data from TF2BD
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
    // Add an icon if their account is young
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
    // Add an icon if the player has any VAC or Game bans
    !!hasBans && (
      <Tooltip
        key="hasbans"
        className="mr-1"
        direction="left"
        content={
          `${t('TOOLTIP_BANS_VAC').replace(
            '%1%',
            player.steamInfo?.vacBans?.toFixed(0) ?? '0',
          )}\n` +
          `${t('TOOLTIP_BANS_GAME').replace(
            '%1%',
            player.steamInfo?.gameBans?.toFixed(0) ?? '0',
          )}\n` +
          `${t('TOOLTIP_BANS_DAYS').replace(
            '%1%',
            player.steamInfo?.daysSinceLastBan?.toFixed(0) ?? '0',
          )}`
        }
      >
        <ShieldAlert width={18} height={18} />
      </Tooltip>
    ),
    // Highlight players who have cheater friends
    !!cheaterFriendsInLobby?.length && (
      <Tooltip
        key="cheaterfriends"
        className="mr-1"
        direction="left"
        content={`${t('TOOLTIP_FRIENDS_WITH_CHEATERS')}\n${cheaterFriendsInLobby
          .map((cf) => cf.name || cf.steamID64)
          .join('\n')}`}
      >
        <Users2 width={18} height={18} />
      </Tooltip>
    ),
    // Add a refresh icon if the data on this account is potentially stale.
    stale && (
      <Tooltip
        key="stale"
        className="mr-1"
        direction="left"
        content={
          fetchedDate
            ? `${t(
                'DATA_LAST_RETRIEVED',
              )} ${fetchedDate?.toLocaleDateString()}\n${t('CLICK_TO_REFRESH')}`
            : `${t('NO_DATA')}\n${t('CLICK_TO_COLLECT_DATA')}`
        }
      >
        <RotateCw
          className={isRefreshing ? 'refresh-spinner' : ''}
          onClick={(event) => {
            event.preventDefault();
            setRefreshing(true);
            updateSteamInfo([player.steamID64]).then((r) => {
              if(r) {
                player.steamInfo = r[0].steamInfo;
              }
              setRefreshing(false);
            }).catch(() => {
              setRefreshing(false);
            });
          }}
          width={18}
          height={18}
        />
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
  buildIconListFromArchive,
};
