import React from 'react';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { ContextMenuProvider } from '@context';
import {
  DEFAULT_HEADER_SORT,
  RATING_SORT_ORDER,
  SORT_OPTIONS,
  SORT_TYPES,
  SORTABLE_SCOREBOARD_HEADERS,
  TableHeaderSorting,
} from '../../../constants/tableConstants';
import { SortableTableHeader } from './SortableTableHeader';
import { VERDICT_TYPES } from '../../../constants/playerConstants';

import './ScoreboardTable.css';

interface ScoreboardTableProps {
  RED: PlayerInfo[];
  BLU: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED }: ScoreboardTableProps) => {
  // Store the users playerID
  const [userSteamID, setUserSteamID] = React.useState('0');
  const [playerSettings, setPlayerSettings] = React.useState<
    Settings['external']
  >({
    colors: {
      You: 'none',
      Player: 'none',
      Friend: 'none',
      Trusted: 'none',
      Suspicious: 'none',
      FriendOfCheater: 'none',
      Convict: 'none',
      Cheater: 'none',
      Bot: 'none',
    },
    openInApp: false,
  });

  React.useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const { external } = await getAllSettings(); // Replace this with the actual async function that fetches colors
        setPlayerSettings(external);
      } catch (error) {
        console.error('Error fetching team colors:', error);
      }
    };
    fetchTeamColors();
  }, []);

  React.useEffect(() => {
    const fetchSelf = () => {
      const combinedPlayers = RED?.concat(BLU ?? []);
      const self = combinedPlayers?.find((player) => player.isSelf);
      setUserSteamID(self?.steamID64 || '0');
    };

    fetchSelf(); // Initial fetch

    const interval = setInterval(() => {
      if (userSteamID !== '0') {
        clearInterval(interval); // We found our user, wipe timer
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [RED, BLU]);

  const renderTeam = (team: PlayerInfo[], teamColor?: string) => {
    const [currentSort, updateCurrentSorting] =
      React.useState(DEFAULT_HEADER_SORT);
    // Subtract amount of disconnected players from the actual playercount
    const amountDisconnected = team?.filter(
      (player) => player.gameInfo.state === 'Disconnected',
    ).length;

    const cheaters = RED.concat(BLU).filter(
      (p) => p.convicted || ['Cheater', 'Bot'].includes(p.localVerdict ?? ''),
    );

    const getSortedPlayers = React.useCallback(() => {
      if (currentSort.sortType === SORT_TYPES.UNSORTED) {
        return team;
      }

      switch (currentSort.sortValue) {
        case SORT_OPTIONS.SORT_BY_USER: {
          return team.sort((curr, next) => {
            // this check is here in all cases to ensure that the current user
            // is always displayed first within the table.
            // This makes sense to me but maybe there should be a setting for this
            // ¯\_(；一_一)_/¯
            if (next.isSelf) {
              return 1;
            }

            return currentSort.sortType === SORT_TYPES.SORT_ASC
              ? curr.name.localeCompare(next.name)
              : next.name.localeCompare(curr.name);
          });
        }

        case SORT_OPTIONS.SORT_BY_TIME: {
          return team.sort((curr, next) => {
            if (next.isSelf) {
              return 1;
            }

            return currentSort.sortType === SORT_TYPES.SORT_ASC
              ? curr.gameInfo.time - next.gameInfo.time
              : next.gameInfo.time - curr.gameInfo.time;
          });
        }

        case SORT_OPTIONS.SORT_BY_RATING: {
          return team.sort((curr, next) => {
            if (next.isSelf) {
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
    }, [currentSort, team]);

    const sortedPlayers = getSortedPlayers();

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half ${teamColor}`}>
        <div
          className={`text-4xl font-build mt-3 mb-9 ${teamColor?.toLowerCase()}`}
        >
          {teamColor} ({team?.length - amountDisconnected})
        </div>
        <div className="flex-1 ml-5 mb-5 text-start font-build grid grid-cols-scoreboardnavsm xs:grid-cols-scoreboardnav">
          {SORTABLE_SCOREBOARD_HEADERS.map((header) => (
            <SortableTableHeader
              header={header}
              currentSort={currentSort}
              changeSort={(newSort: TableHeaderSorting) => {
                updateCurrentSorting(newSort);
              }}
            />
          ))}
          {/* <div className="hidden xs:[display:unset]">
            {t('TEAM_NAV_STATUS')}
          </div> */}
        </div>
        <div className={`${teamColor?.toLowerCase()}`}>
          {sortedPlayers?.map((player) => (
            // Provide the Context Menu Provider to the Element
            <ContextMenuProvider key={player.steamID64}>
              <Player
                playerColors={playerSettings.colors}
                className={teamColor?.toLowerCase()}
                player={player}
                key={player.steamID64}
                openInApp={playerSettings.openInApp}
                cheatersInLobby={cheaters}
              />
            </ContextMenuProvider>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-scoreboardgridsm lg:grid-cols-scoreboardgrid text-center h-screen overflow-x-hidden">
      {renderTeam(BLU, 'BLU')}
      <div className="scoreboard-divider hidden sm:[display:unset] h-5/6 bg-highlight/10 w-[1px] mt-9" />
      {renderTeam(RED, 'RED')}
    </div>
  );
};

export default ScoreboardTable;
