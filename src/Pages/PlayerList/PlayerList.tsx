import React, { Fragment } from 'react';
import { useMinimode } from '@context';
import { MiniScoreboard, ScoreboardTable } from '@components/TF2';
import { emptyServerData, fetchAllServerInfo } from '@api/servers';

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
  const [SPEC, setSPEC] = React.useState<PlayerInfo[]>([]);
  const [UNASSIGNED, setUNASSIGNED] = React.useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const newData = await fetchAllServerInfo();
      setData(newData);
    };

    // First Render: Refresh the data Immediately without having to wait for the interval
    fetchData();

    const intervalHandle = setInterval(fetchData, 3000);

    return () => {
      clearInterval(intervalHandle);
    };
  }, []);

  React.useEffect(() => {
    const players = Object.values(data.players);
    const newRED: PlayerInfo[] = [];
    const newBLU: PlayerInfo[] = [];
    const newSPEC: PlayerInfo[] = [];
    const newUNASSIGNED: PlayerInfo[] = [];

    for (const player of players) {
      if (player.gameInfo?.team === Teams.RED) {
        newRED.push(player);
      } else if (player.gameInfo?.team === Teams.BLU) {
        newBLU.push(player);
      } else if (player.gameInfo?.team === Teams.SPEC) {
        newSPEC.push(player);
      } else {
        newUNASSIGNED.push(player);
      }
    }

    const sortByKillsDesc = (a: PlayerInfo, b: PlayerInfo) =>
      b.gameInfo?.kills - a.gameInfo.kills;

    setRED(newRED.sort(sortByKillsDesc));
    setBLU(newBLU.sort(sortByKillsDesc));
    setSPEC(newSPEC.sort(sortByKillsDesc));
    setUNASSIGNED(newUNASSIGNED.sort(sortByKillsDesc));
  }, [data]);

  const sortedRED = React.useMemo(() => {
    return [...RED].sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
  }, [RED]);

  const sortedBLU = React.useMemo(() => {
    return [...BLU].sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
  }, [BLU]);

  const sortedSPEC = React.useMemo(() => {
    return [...SPEC].sort((a, b) => b.gameInfo?.kills - a.gameInfo?.kills);
  }, [SPEC]);

  const sortedUNASSIGNED = React.useMemo(() => {
    return [...UNASSIGNED].sort(
      (a, b) => b.gameInfo?.kills - a.gameInfo?.kills,
    );
  }, [UNASSIGNED]);

  return (
    <Fragment>
      {isMinimode ? (
        <MiniScoreboard RED={sortedRED} BLU={sortedBLU} />
      ) : (
        <ScoreboardTable
          RED={sortedRED}
          BLU={sortedBLU}
          SPEC={sortedSPEC}
          UNASSIGNED={sortedUNASSIGNED}
        />
      )}
    </Fragment>
  );
};

export default PlayerList;
