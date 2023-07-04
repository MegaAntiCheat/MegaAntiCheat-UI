import React, { ReactNode, useState } from "react";
import "./ScoreboardTable.css";

import { Player } from "../";
import { Flex } from "../../General";
import { fetchAllServerInfo } from "../../../api";
import { emptyData } from "../../../api/fakeData";

let intervalHandle: number;
interface ScoreboardTableType {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}

const ScoreboardTable = ({ BLU, RED }: ScoreboardTableType) => {
  return (
    <div className="scoreboard-grid-container">
      <div>
        <div className="scoreboard-team blu">BLU</div>
        <div className="scoreboard-blu">
          <Flex className="scoreboard-header">
            <div>Rating</div>
            <div>User</div>
            <div>Status</div>
            <div>Time</div>
          </Flex>
          {BLU?.map((player) => {
            return (
              <Player
                name={player.name}
                you={player.isSelf}
                state={player.gameInfo?.state}
                className="blu"
                key={player.steamID64}
              />
            );
          })}
        </div>
      </div>
      <div className="scoreboard-divider" />
      <div>
        <div className="scoreboard-team red">RED</div>
        <div className="scoreboard-red">
          <Flex className="scoreboard-header">
            <div>Rating</div>
            <div>User</div>
            <div>Status</div>
            <div>Time</div>
          </Flex>
          {RED?.map((player) => {
            return (
              <Player
                name={player.name}
                you={player.isSelf}
                state={player.gameInfo?.state}
                className="red"
                key={player.steamID64}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreboardTable;
