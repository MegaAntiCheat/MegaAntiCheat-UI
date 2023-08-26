import { hexToRGB } from '@api/utils';
import { t } from '@i18n';

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

function formatTime(seconds: number): string {
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
  const alias = player?.customData?.alias;

  if (alias) nameList += `Current Name:\n\n${player.name}\n`;
  if (player.previousNames?.length)
    nameList += `Previous Names:\n\n${player.previousNames.join('\n')}`;

  return nameList;
}

export {
  localizeVerdict,
  formatTime,
  displayProperStatus,
  displayColor,
  makeLocalizedVerdictOptions,
  calculateKD,
  displayNamesList,
};
