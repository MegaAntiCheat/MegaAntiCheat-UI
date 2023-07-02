import React from "react";
import "./PlayerList.css";
import { Divider, TextItem } from "../../components/General";
import Player from "../../components/TF2/Player/Player";
import { ScoreboardTable } from "../../components/TF2";

const PlayerList = () => {
  return (
    <>
      <ScoreboardTable />
    </>
  );
};

export default PlayerList;
