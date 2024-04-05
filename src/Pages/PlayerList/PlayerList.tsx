import React from 'react';
import { useMinimode } from '@context';
import { MiniScoreboard, ScoreboardTable } from '@components/TF2';
import { emptyServerData, fetchAllServerInfo } from '@api/servers';
import './PlayerList.css';
import LivePlayer from '@components/TF2/Player/LivePlayer';
import { getAllSettings } from '@api/preferences';

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

  // Store the users playerID
  const [userSteamID, setUserSteamID] = React.useState('0');
  const [playerSettings, setPlayerSettings] = React.useState<
    Settings['external']
  >({
    colors: {
      You: 'none',
      Player: 'none',
      Friend: 'none',
      Trusted: 'none',
      Suspicious: 'none',
      FriendOfCheater: 'none',
      Convict: 'none',
      Cheater: 'none',
      Bot: 'none',
    },
    openInApp: false,
  });

  const playerSort = (a: PlayerInfo, b: PlayerInfo) =>
      (b.gameInfo?.kills ?? 0) - (a.gameInfo?.kills ?? 0);

  React.useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const { external } = await getAllSettings(); // Replace this with the actual async function that fetches colors
        setPlayerSettings(external);
      } catch (error) {
        console.error('Error fetching team colors:', error);
      }
    };
    fetchTeamColors();
  }, []);

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

      if(player.isSelf) {
        setUserSteamID(player.steamID64);
      }
    }

    setRED(newRED);
    setBLU(newBLU);
    setSPEC(newSPEC);
    setUNASSIGNED(newUNASSIGNED);
  }, [data]);

  function buildPlayer(player: PlayerInfo): React.JSX.Element {
    return LivePlayer({
      player: player,
      cheatersInLobby: data.players.filter(c => c.convicted || c.localVerdict === "Cheater"),
      icon: player.steamInfo?.pfp,
      openInApp: playerSettings.openInApp,
      playerColors: playerSettings.colors,
      className: "RED"
    })
  }

  const [sortedRED, sortedBLU, sortedSPEC, sortedUNASSIGNED] = [RED, BLU, SPEC, UNASSIGNED].map(t => {
    return React.useMemo(() => {
      return [...t]
        .sort(playerSort)
        .map(buildPlayer);
    }, [t]);
  });

  const players = new Map<string, React.JSX.Element[]>([
      ["RED", sortedRED],
      ["BLU", sortedBLU],
      ["SPECTATOR", sortedSPEC],
      ["UNASSIGNED", sortedUNASSIGNED]
  ]);

  return (
    <>
      <div className="playerlist-max">
        {isMinimode ? (
          <MiniScoreboard
            RED={[...RED].sort(playerSort)}
            BLU={[...BLU].sort(playerSort)}
          />
        ) : (
          <ScoreboardTable
            players={players}
            extraDataHeader='TIME'
            columnSpacing='player'
          />
        )}
      </div>
    </>
  );
};

export default PlayerList;
