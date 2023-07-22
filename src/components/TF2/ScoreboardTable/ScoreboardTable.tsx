import React from 'react';
import './ScoreboardTable.css';

import { PopoutInfo } from '@components/TF2';
import { Flex } from '@components/General';
import { t } from '@i18n';
interface ScoreboardTableType {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED }: ScoreboardTableType) => {
  const renderTeam = (team?: PlayerInfo[], teamColor?: string) => {
    return (
      <div>
        <div className={`scoreboard-header ${teamColor?.toLowerCase()}`}>
          {teamColor} ({team?.length ?? 0})
        </div>
        <Flex className="scoreboard-nav">
          <div>{t('TEAM_NAV_RATING')}</div>
          <div>{t('TEAM_NAV_USER')}</div>
          <div>{t('TEAM_NAV_STATUS')}</div>
          <div>{t('TEAM_NAV_TIME')}</div>
        </Flex>
        <div className={`scoreboard-team ${teamColor?.toLowerCase()}`}>
          {team?.map((player) => (
            // This is the Player Component wrapped in the Popout info component
            <PopoutInfo
              className={teamColor?.toLowerCase()}
              player={player}
              key={player.steamID64}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="scoreboard-grid-container">
      {renderTeam(BLU, 'BLU')}
      <div className="scoreboard-divider" />
      {renderTeam(RED, 'RED')}
    </div>
  );
};

export default ScoreboardTable;
