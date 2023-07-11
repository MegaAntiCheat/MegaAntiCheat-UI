import React, { useState } from 'react';
import { fetchAllServerInfo, emptyServerData } from '../../api';
import { ScoreboardTable } from '../../components/TF2';
import MiniScoreboard from '../../components/TF2/MiniScoreboard/MiniScoreboard';
import './PlayerList.css';

enum Teams {
  UNASSIGNED,
  SPEC,
  RED,
  BLU,
}

const PlayerList = () => {
  const [data, setData] = React.useState(emptyServerData);
  const [RED, setRED] = useState<PlayerInfo[]>([]);
  const [BLU, setBLU] = useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const newData = await fetchAllServerInfo();
      setData(newData);
    };

    // First Render: Refreshes the data Immediately without having to wait for the interval
    fetchData();

    const intervalHandle = setInterval(fetchData, 10000);

    return () => {
      clearInterval(intervalHandle);
    };
  }, []);

  React.useEffect(() => {
    const players = Object.values(data.players);
    const newRED: PlayerInfo[] = [];
    const newBLU: PlayerInfo[] = [];

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
      <div className="playerlist-max">
        <ScoreboardTable RED={RED} BLU={BLU} />
      </div>
    </>
  );
};

export default PlayerList;
