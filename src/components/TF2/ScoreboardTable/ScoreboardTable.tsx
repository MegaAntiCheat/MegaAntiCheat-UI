import React from 'react';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { ContextMenuProvider } from '@context';
import {
  DEFAULT_SORT_ORDER,
  SORTABLE_SCOREBOARD_HEADERS,
  Sorting,
} from '../../../constants/tableConstants';
import { SortableTableHeader } from './SortableTableHeader';
import { sortByFilter } from './soreboardUtils';

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
  const [currentSort, updateCurrentSorting] =
    React.useState<Sorting>(DEFAULT_SORT_ORDER);

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
    // Subtract amount of disconnected players from the actual playercount
    const amountDisconnected = team?.filter(
      (player) => player.gameInfo.state === 'Disconnected',
    ).length;

    const cheaters = RED.concat(BLU).filter(
      (p) => p.convicted || ['Cheater', 'Bot'].includes(p.localVerdict ?? ''),
    );

    const getSortedPlayers = React.useCallback(
      () =>
        sortByFilter({
          currentSort,
          team,
          playerSettings,
        }),
      [currentSort, team],
    );

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
              changeSort={(newSort: Sorting) => {
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
