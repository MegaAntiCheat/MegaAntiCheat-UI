import React, { useState } from 'react';
import { Flex, Search, Select, TextItem } from '../../components/General';
import { fetchPlayerHistory } from '../../api';
import PlayerHistoryCard from '../../components/TF2/PlayerHistoryCard/PlayerHistoryCard';

import './PlayerHistory.css';

const PlayerHistory = () => {
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [searchResults, setSearchResults] = useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      const newData = await fetchPlayerHistory();
      setPlayers(newData);
      setSearchResults(newData);
    };

    fetchHistoryData();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setSearchResults(players);
    } else {
      const filteredResults = players.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filteredResults);
    }
  };

  return (
    <div>
      <TextItem fontSize="h1" className="page-header">
        Player History
      </TextItem>
      <Flex>
        <Search
          placeholder="Search for Players"
          className="history-search"
          onChange={handleSearch}
        />
      </Flex>
      <div className="playerhistory-container custom-scollbar">
        {searchResults.length > 0 ? (
          searchResults.map((player) => (
            <PlayerHistoryCard player={player} key={player.steamID64} />
          ))
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default PlayerHistory;
