import React from 'react';
import './ScoreboardTable.css';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { t } from '@i18n';
import { ContextMenuProvider } from '@context';
interface ScoreboardTableProps {
  RED: PlayerInfo[];
  BLU: PlayerInfo[];
  SPEC: PlayerInfo[];
  UNASSIGNED: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED, SPEC, UNASSIGNED}: ScoreboardTableProps) => {
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
      const combinedPlayers = RED?.concat(BLU ?? [], SPEC ?? [], UNASSIGNED ?? []);
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
  }, [RED, BLU, SPEC, UNASSIGNED]);

  const renderTeam = (team: PlayerInfo[], teamColor?: string) => {
    // Subtract amount of disconnected players from the actual playercount
    const amountDisconnected = team?.filter(
      (player) => player.gameInfo.state === 'Disconnected',
    ).length;

    const combinedPlayers = RED?.concat(BLU ?? [], SPEC ?? [], UNASSIGNED ?? []);

    const cheaters = combinedPlayers.filter(
      (p) => p.convicted || ['Cheater', 'Bot'].includes(p.localVerdict ?? ''),
    );

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half ${teamColor}`}>
        <div
          className={`text-4xl font-build mt-4 mb-3 ${teamColor?.toLowerCase()}`}
        >
          {teamColor} ({team?.length - amountDisconnected})
        </div>
        <div className="flex-1 ml-5 mb-5 text-start font-build grid grid-cols-scoreboardnavsm xs:grid-cols-scoreboardnav">
          <div>{t('TEAM_NAV_RATING')}</div>
          <div>{t('TEAM_NAV_USER')}</div>
          {/* <div className="hidden xs:[display:unset]">
            {t('TEAM_NAV_STATUS')}
          </div> */}
          <div className="hidden xs:[display:unset]">{t('TEAM_NAV_TIME')}</div>
        </div>
        <div className={`${teamColor?.toLowerCase()} mb-4`}>
          {team?.map((player) => (
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
    <div className="grid grid-cols-scoreboardgridsm lg:grid-cols-scoreboardgrid text-center h-max-content lg:h-max-content overflow-x-hidden">
      {renderTeam(BLU, 'BLU')}
      <div className="scoreboard-divider lg:[display:block] h-auto bg-highlight/10 w-[1px] mt-0" />
      {renderTeam(RED, 'RED')}
      <div className="scoreboard-divider lg:[display:none] h-auto bg-highlight/10 w-[1px] mt-0" />
      {renderTeam(SPEC, 'SPECTATOR')}
      <div className="scoreboard-divider lg:[display:block] h-auto bg-highlight/10 w-[1px] mt-0" />
      {renderTeam(UNASSIGNED, 'UNASSIGNED')}
    </div>
  );
};

export default ScoreboardTable;
