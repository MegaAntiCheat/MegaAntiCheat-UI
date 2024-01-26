import { VERDICT_TYPES } from '../../../constants/playerConstants';
import {
  RATING_SORT_ORDER,
  SORT_OPTIONS,
  SORT_TYPES,
  Sorting,
} from '../../../constants/tableConstants';

interface SortByFilterProps {
  currentSort: Sorting;
  team: PlayerInfo[];
  playerSettings: Settings['external'];
}

export const sortByFilter = ({
  currentSort,
  team,
  playerSettings,
}: SortByFilterProps): PlayerInfo[] => {
  if (currentSort.sortType === SORT_TYPES.UNSORTED) {
    return team;
  }

  switch (currentSort.sortValue) {
    case SORT_OPTIONS.SORT_BY_USER: {
      return team.sort((curr, next) => {
        if (next.isSelf) return 1;
        if (curr.isSelf) return 0;

        if (playerSettings.sortDisconnectedLast) {
          if (
            next.gameInfo.state === 'Disconnected' ||
            curr.gameInfo.state === 'Disconnected'
          )
            return 1;
        }

        return currentSort.sortType === SORT_TYPES.SORT_ASC
          ? curr.name.localeCompare(next.name)
          : next.name.localeCompare(curr.name);
      });
    }

    case SORT_OPTIONS.SORT_BY_TIME: {
      return team.sort((curr, next) => {
        if (next.isSelf) return 1;
        if (curr.isSelf) return 0;

        if (playerSettings.sortDisconnectedLast) {
          if (
            next.gameInfo.state === 'Disconnected' ||
            curr.gameInfo.state === 'Disconnected'
          )
            return 1;
        }

        if (currentSort.sortType === SORT_TYPES.SORT_ASC) {
          if (next.gameInfo.state === 'Disconnected') return 1;
          if (curr.gameInfo.state === 'Disconnected') return 0;

          return curr.gameInfo.time - next.gameInfo.time;
        }

        if (curr.gameInfo.state === 'Disconnected') return 1;
        if (next.gameInfo.state === 'Disconnected') return 0;

        return next.gameInfo.time - curr.gameInfo.time;
      });
    }

    case SORT_OPTIONS.SORT_BY_RATING: {
      return team.sort((curr, next) => {
        if (next.isSelf) return 1;
        if (curr.isSelf) return 0;

        if (playerSettings.sortDisconnectedLast) {
          if (
            next.gameInfo.state === 'Disconnected' ||
            curr.gameInfo.state === 'Disconnected'
          )
            return 1;
        }

        const currRatingScore =
          RATING_SORT_ORDER[
            (curr.localVerdict as VERDICT_TYPES | undefined) ?? 'None'
          ];
        const nextRatingScore =
          RATING_SORT_ORDER[
            (next.localVerdict as VERDICT_TYPES | undefined) ?? 'None'
          ];

        return currentSort.sortType === SORT_TYPES.SORT_ASC
          ? currRatingScore - nextRatingScore
          : nextRatingScore - currRatingScore;
      });
    }

    default: {
      return team;
    }
  }
};
