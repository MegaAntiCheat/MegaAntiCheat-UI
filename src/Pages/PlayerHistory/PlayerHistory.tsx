import React, { useState } from 'react';
import { t } from '@i18n';
import { fetchPlayerHistory } from '@api/players';
import { PlayerHistoryCard } from '@components/TF2';
import { Flex, Search, TextItem } from '@components/General';

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
        {t('PLAYERHISTORY')}
      </TextItem>
      <Flex className="history-options">
        <Search
          placeholder={t('PLAYER_SEARCH')}
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
