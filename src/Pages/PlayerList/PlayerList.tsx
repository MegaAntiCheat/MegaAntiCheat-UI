import React from 'react';
import { useMinimode } from '@context';
import { MiniScoreboard, ScoreboardTable } from '@components/TF2';
import { emptyServerData, fetchAllServerInfo } from '@api/servers';
import './PlayerList.css';

enum Teams {
  UNASSIGNED,
  SPEC,
  RED,
  BLU,
}

const PlayerList = () => {
  const { isMinimode } = useMinimode();

  const [data, setData] = React.useState(emptyServerData);
  const [RED, setRED] = React.useState<PlayerInfo[]>([]);
  const [BLU, setBLU] = React.useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const newData = await fetchAllServerInfo();
      setData(newData);
    };

    // First Render: Refresh the data Immediately without having to wait for the interval
    fetchData();

    const intervalHandle = setInterval(fetchData, 10000);

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
    // Sort after kills (highest to lowest)
    newRED = newRED.sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
    newBLU = newBLU.sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);

    setRED(newRED);
    setBLU(newBLU);
  }, [data]);

  return (
    <>
      <div className="playerlist-max">
        {isMinimode ? (
          <MiniScoreboard RED={RED} BLU={BLU} />
        ) : (
          <ScoreboardTable RED={RED} BLU={BLU} />
        )}
      </div>
    </>
  );
};

export default PlayerList;
