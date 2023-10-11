import React from 'react';

import { t } from '@i18n';
import { hexToRGB } from '@api/utils';
import { CalendarClock, ScrollText, ShieldAlert, Star } from 'lucide-react';
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
) {
  const ALPHA = '0.35';
  const you = player.isSelf;
  const verdict = player.localVerdict!;

  const { convicted } = player;

  if (you) return hexToRGB(playerColors['You'], ALPHA);

  if (!verdict || verdict.includes('None') || verdict.includes('Player'))
    return hexToRGB(playerColors['Player'], ALPHA);

  if (convicted) return hexToRGB(playerColors['Cheater'], ALPHA);

  return hexToRGB(playerColors[verdict], ALPHA);
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

function buildIconList(player: PlayerInfo): React.ReactNode[] {
  const alias = player.customData?.alias;
  const playerNote = player.customData?.playerNote;
  const tfbd = player.customData?.tfbd;
  const accCreationTime = player.steamInfo?.timeCreated ?? 0;
  const hasBans =
    (player.steamInfo?.gameBans ?? 0) + (player.steamInfo?.vacBans ?? 0);

  return [
    !!alias && (
      <Tooltip
        className="mr-1"
        content={`${t('TOOLTIP_ACTUAL_NAME')}\n${player.name}`}
      >
        <Star width={18} height={18} />
      </Tooltip>
    ),
    (!!playerNote || !!tfbd) && (
      <Tooltip className="mr-1" content={buildPlayerNote(player.customData)}>
        <ScrollText width={18} height={18} />
      </Tooltip>
    ),
    accCreationTime < 30 * 24 * 60 * 60 && ( // 2 Months
      <Tooltip className="mr-1" content={t('TOOLTIP_NEW_ACCOUNT')}>
        <CalendarClock width={18} height={18} />
      </Tooltip>
    ),
    !!hasBans && (
      <Tooltip
        className="mr-1"
        content={`${player.steamInfo?.vacBans ?? 0} ${t('TOOLTIP_BANS_VAC')}\n${
          player.steamInfo?.gameBans ?? 0
        } ${t('TOOLTIP_BANS_GAME')}\n${
          player.steamInfo?.daysSinceLastBan ?? 0
        } ${t('TOOLTIP_BANS_DAYS')}`}
      >
        <ShieldAlert width={18} height={18} />
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
