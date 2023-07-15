import React from 'react';
import './ScoreboardTable.css';

import { Player } from '@components/TF2';
import { Flex } from '@components/General';
import { t } from '@i18n';
interface ScoreboardTableType {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED }: ScoreboardTableType) => {
  return (
    <div className="scoreboard-grid-container">
      <div>
        <div className="scoreboard-header blu">BLU</div>
        <div className="scoreboard-team">
          <Flex className="scoreboard-nav">
            <div>{t('TEAM_NAV_RATING')}</div>
            <div>{t('TEAM_NAV_USER')}</div>
            <div>{t('TEAM_NAV_STATUS')}</div>
            <div>{t('TEAM_NAV_TIME')}</div>
          </Flex>
          {BLU?.map((player) => {
            return (
              <Player className="blu" player={player} key={player.steamID64} />
            );
          })}
        </div>
      </div>
      <div className="scoreboard-divider" />
      <div>
        <div className="scoreboard-header red">RED</div>
        <div className="scoreboard-team">
          <Flex className="scoreboard-nav">
            <div>{t('TEAM_NAV_RATING')}</div>
            <div>{t('TEAM_NAV_USER')}</div>
            <div>{t('TEAM_NAV_STATUS')}</div>
            <div>{t('TEAM_NAV_TIME')}</div>
          </Flex>
          {RED?.map((player) => {
            return (
              <Player className="red" player={player} key={player.steamID64} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreboardTable;
