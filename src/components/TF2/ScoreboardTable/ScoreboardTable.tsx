import React, { ReactNode } from "react";
import "./ScoreboardTable.css";

import { Player } from "../";
import { Flex } from "../../General";

interface ScoreboardTableType {
  children?: ReactNode;
}

const ScoreboardTable = ({ children }: ScoreboardTableType) => {
  return (
    <div className="scoreboard-grid-container">
      <div>
        <div className="scoreboard-team blu">BLU</div>
        <div className="scoreboard-blu">
          <Flex className="scoreboard-header">
            <div>Rating</div>
            <div>Name</div>
            <div>Status</div>
            <div>Time</div>
          </Flex>
          <Player you={true} status="In-Game" time="53:54" />
          <Player name="Coolskeleton420" status="In-Game" time="13:20" />
          <Player name="Sammy" time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
        </div>
      </div>
      <div className="scoreboard-divider" />
      <div>
        <div className="scoreboard-team red">RED</div>
        <div className="scoreboard-red">
          <Flex className="scoreboard-header">
            <div>Rating</div>
            <div>Name</div>
            <div>Status</div>
            <div>Time</div>
          </Flex>
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
          <Player time="00:00" />
        </div>
      </div>
    </div>
  );
};

export default ScoreboardTable;
