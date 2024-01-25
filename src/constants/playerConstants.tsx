export type VERDICT_TYPES =
  | 'Player'
  | 'Bot'
  | 'Cheater'
  | 'Suspicious'
  | 'Trusted'
  | 'None';

interface VERDICT_OPTION {
  label: string;
  value: VERDICT_TYPES | string;
}

export const LOCAL_VERDICT_OPTIONS: VERDICT_OPTION[] = [
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
