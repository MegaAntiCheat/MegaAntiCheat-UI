import { VERDICT_TYPES } from './playerConstants';

export enum SORT_TYPES {
  UNSORTED,
  SORT_ASC,
  SORT_DESC,
}

export enum SORT_OPTIONS {
  SORT_BY_USER,
  SORT_BY_TIME,
  SORT_BY_RATING,
}

export interface TableHeaderSorting {
  sortValue: SORT_OPTIONS;
  sortType: SORT_TYPES;
}

export interface SortableHeader {
  sortValue: SORT_OPTIONS;
  nameKey: string;
  hideWhenSmall?: boolean;
}

export const DEFAULT_HEADER_SORT: TableHeaderSorting = {
  sortValue: SORT_OPTIONS.SORT_BY_USER,
  sortType: SORT_TYPES.UNSORTED,
};

export const SORTABLE_SCOREBOARD_HEADERS: SortableHeader[] = [
  { sortValue: SORT_OPTIONS.SORT_BY_RATING, nameKey: 'TEAM_NAV_RATING' },
  { sortValue: SORT_OPTIONS.SORT_BY_USER, nameKey: 'TEAM_NAV_USER' },
  {
    sortValue: SORT_OPTIONS.SORT_BY_TIME,
    nameKey: 'TEAM_NAV_TIME',
    hideWhenSmall: true,
  },
];

export const RATING_SORT_ORDER: {
  [Property in VERDICT_TYPES]: number;
} = {
  Trusted: 0,
  Player: 1,
  None: 1, // This should appear as "Player" either way
  Suspicious: 2,
  Cheater: 3,
  Bot: 4,
};
