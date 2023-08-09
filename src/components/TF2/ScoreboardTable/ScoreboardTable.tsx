import React from 'react';
import './ScoreboardTable.css';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { t } from '@i18n';
import { ContextMenuProvider } from '@components/General/ContextMenu/ContextMenuProvider';
interface ScoreboardTableProps {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED }: ScoreboardTableProps) => {
  // Update the Scoreboard everytime a PFP is loaded
  const [, setLoadedPFPCount] = React.useState(0);
  const [playerColors, setPlayerColors] = React.useState<
    Settings['external']['colors']
  >({
    You: 'none',
    Player: 'none',
    Trusted: 'none',
    Suspicious: 'none',
    Cheater: 'none',
    Bot: 'none',
  });

  const handlePFPImageLoad = () => {
    setLoadedPFPCount((prevCount) => prevCount + 1);
  };

  React.useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const { colors } = (await getAllSettings()).external; // Replace this with the actual async function that fetches colors
        setPlayerColors(colors);
      } catch (error) {
        console.error('Error fetching team colors:', error);
      }
    };
    fetchTeamColors();
  }, []);

  const renderTeam = (team?: PlayerInfo[], teamColor?: string) => {
    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half ${teamColor}`}>
        <div
          className={`text-4xl font-build mt-3 mb-9 ${teamColor?.toLowerCase()}`}
        >
          {teamColor} ({team?.length ?? 0})
        </div>
        <div className="flex-1 ml-5 mb-5 text-start font-build grid grid-cols-scoreboardnavsm xs:grid-cols-scoreboardnav">
          <div>{t('TEAM_NAV_RATING')}</div>
          <div>{t('TEAM_NAV_USER')}</div>
          <div className="hidden xs:[display:unset]">
            {t('TEAM_NAV_STATUS')}
          </div>
          <div className="hidden xs:[display:unset]">{t('TEAM_NAV_TIME')}</div>
        </div>
        <div className={`${teamColor?.toLowerCase()}`}>
          {team?.map((player) => (
            <ContextMenuProvider>
              <Player
                playerColors={playerColors}
                className={teamColor?.toLowerCase()}
                player={player}
                key={player.steamID64}
                onImageLoad={handlePFPImageLoad}
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
