import { useEffect, useState } from 'react';
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

const ScoreboardTable = ({
  BLU,
  RED,
  SPEC,
  UNASSIGNED,
}: ScoreboardTableProps) => {
  // Store the users playerID
  const [userSteamID, setUserSteamID] = useState('0');
  const [playerSettings, setPlayerSettings] = useState<Settings['external']>({
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

  useEffect(() => {
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

  useEffect(() => {
    const fetchSelf = () => {
      const combinedPlayers = RED?.concat(
        BLU ?? [],
        SPEC ?? [],
        UNASSIGNED ?? [],
      );
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

  const renderTeam = (team: PlayerInfo[], teamName?: string) => {
    // Subtract amount of disconnected players from the actual playercount
    const amountDisconnected = team?.filter(
      (player) => player.gameInfo.state === 'Disconnected',
    ).length;

    const combinedPlayers = RED?.concat(
      BLU ?? [],
      SPEC ?? [],
      UNASSIGNED ?? [],
    );

    const cheaters = combinedPlayers.filter(
      (p) => p.convicted || ['Cheater', 'Bot'].includes(p.localVerdict ?? ''),
    );

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half pb-[10px] ${teamName}`}>
        <div
          className={`mb-1 mt-4 font-build text-4xl ${teamName?.toLowerCase()}`}
        >
          {t(teamName ?? 'UNASSIGNED').toUpperCase()} (
          {team?.length - amountDisconnected})
        </div>

        <div className="grid grid-cols-4 px-2 font-build">
          <p className="text-start">{t('TEAM_NAV_RATING')}</p>
          <p className="text-start">{t('TEAM_NAV_USER')}</p>
          <p className="text-end">{t('TEAM_NAV_STATUS')}</p>
          <p className="text-end">{t('TEAM_NAV_TIME')}</p>
        </div>

        <div className={`${teamName?.toLowerCase()}`}>
          {team?.map((player) => (
            <ContextMenuProvider key={player.steamID64}>
              <Player
                playerColors={playerSettings.colors}
                className={teamName?.toLowerCase()}
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

  // For Versus Saxton Hale (and any other gamemodes with a significant team imbalance), we want to leave one half to RED team and the other half for BLU, SPEC, and UNASSIGNED.
  if (
    RED.length >= 12 &&
    RED.length > BLU.length + SPEC.length + UNASSIGNED.length + 8
  ) {
    return (
      <div className="grid grid-cols-scoreboardgridsm place-content-start text-center lg:grid-cols-scoreboardgrid">
        <div>
          {renderTeam(BLU, 'BLU')}
          {renderTeam(SPEC, 'SPECTATOR')}
          {renderTeam(UNASSIGNED, 'UNASSIGNED')}
        </div>
        <div className="scoreboard-divider mt-0 h-auto w-[1px] bg-highlight/10 lg:[display:block]" />
        {renderTeam(RED, 'RED')}
      </div>
    );
  }

  // Need to do the opposite as well for zombie infection
  if (
    BLU.length >= 12 &&
    BLU.length > RED.length + SPEC.length + UNASSIGNED.length + 8
  ) {
    return (
      <div className="grid grid-cols-scoreboardgridsm place-content-start text-center lg:grid-cols-scoreboardgrid">
        {renderTeam(BLU, 'BLU')}
        <div className="scoreboard-divider mt-0 h-auto w-[1px] bg-highlight/10 lg:[display:block]" />
        <div>
          {renderTeam(RED, 'RED')}
          {renderTeam(UNASSIGNED, 'UNASSIGNED')}
          {renderTeam(SPEC, 'SPECTATOR')}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-scoreboardgridsm place-content-start text-center lg:grid-cols-scoreboardgrid">
      {renderTeam(BLU, 'BLU')}
      <div className="scoreboard-divider mt-0 h-auto w-[1px] bg-highlight/10 lg:[display:block]" />
      {renderTeam(RED, 'RED')}
      {renderTeam(SPEC, 'SPECTATOR')}
      <div className="scoreboard-divider mt-0 h-auto w-[1px] bg-highlight/10 lg:[display:block]" />
      {renderTeam(UNASSIGNED, 'UNASSIGNED')}
    </div>
  );
};

export default ScoreboardTable;
