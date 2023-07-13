import React from 'react';
import './ScoreboardTable.css';

import { Player } from '@components/TF2';
import { Flex } from '@components/General';
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
            <div>Rating</div>
            <div>User</div>
            <div>Status</div>
            <div>Time</div>
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
            <div>Rating</div>
            <div>User</div>
            <div>Status</div>
            <div>Time</div>
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
