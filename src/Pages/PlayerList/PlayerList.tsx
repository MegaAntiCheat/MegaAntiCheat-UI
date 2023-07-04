import React, { useState } from "react";
import "./PlayerList.css";
import { Divider, TextItem } from "../../components/General";
import Player from "../../components/TF2/Player/Player";
import { ScoreboardTable } from "../../components/TF2";
import { emptyData } from "../../api/fakeData";
import { fetchAllServerInfo } from "../../api";

enum Teams {
  BLU,
  RED,
  SPEC,
  UNASSIGNED,
}

const PlayerList = () => {
  const [data, setData] = React.useState(emptyData);
  const [RED, setRED] = useState<PlayerInfo[]>([]);
  const [BLU, setBLU] = useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const newData = await fetchAllServerInfo();
      setData(newData);
    };

    fetchData();

    let intervalHandle = setInterval(fetchData, 10000);

    return () => {
      clearInterval(intervalHandle);
    };
  }, []);

  React.useEffect(() => {
    const players = Object.values(data.players);
    let newRED: PlayerInfo[] = [];
    let newBLU: PlayerInfo[] = [];

    for (const player of players) {
      if (player.gameInfo?.team === Teams.RED) {
        newRED.push(player);
      } else if (player.gameInfo?.team === Teams.BLU) {
        newBLU.push(player);
      }
    }

    setRED(newRED);
    setBLU(newBLU);
  }, [data]);

  return (
    <>
      <ScoreboardTable RED={RED} BLU={BLU} />
    </>
  );
};

export default PlayerList;
