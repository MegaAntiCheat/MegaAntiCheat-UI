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
    const newRED: PlayerInfo[] = [];
    const newBLU: PlayerInfo[] = [];

    for (const player of players) {
      if (player.gameInfo?.team === Teams.RED) {
        newRED.push(player);
      } else if (player.gameInfo?.team === Teams.BLU) {
        newBLU.push(player);
      }
    }

    const sortByKillsDesc = (a: PlayerInfo, b: PlayerInfo) =>
      b.gameInfo?.kills - a.gameInfo.kills;

    setRED(newRED.sort(sortByKillsDesc));
    setBLU(newBLU.sort(sortByKillsDesc));
  }, [data]);

  const sortedRED = React.useMemo(() => {
    return [...RED].sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
  }, [RED]);

  const sortedBLU = React.useMemo(() => {
    return [...BLU].sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
  }, [BLU]);

  return (
    <>
      <div className="playerlist-max">
        {isMinimode ? (
          <MiniScoreboard RED={sortedRED} BLU={sortedBLU} />
        ) : (
          <ScoreboardTable RED={sortedRED} BLU={sortedBLU} />
        )}
      </div>
    </>
  );
};

export default PlayerList;
