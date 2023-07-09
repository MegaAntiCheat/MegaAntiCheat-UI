import React from 'react';
import { TextItem } from '../../components/General';
import { fetchPlayerHistory } from '../../api';
import PlayerHistoryCard from '../../components/TF2/PlayerHistoryCard/PlayerHistoryCard';

import './PlayerHistory.css';

const PlayerHistory = () => {
  const [players, setPlayers] = React.useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      const newData = await fetchPlayerHistory();
      setPlayers(newData);
    };

    fetchHistoryData();
  }, []);

  return (
    <div>
      <TextItem fontSize="h1" className="page-header">
        Player History
      </TextItem>
      <div className="search"></div>
      <div className="playerhistory-container custom-scollbar">
        {players.map((player) => (
          <PlayerHistoryCard player={player} key={player.steamID64} />
        ))}
      </div>
    </div>
  );
};

export default PlayerHistory;
