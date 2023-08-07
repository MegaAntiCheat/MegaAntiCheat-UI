import React, { useState } from 'react';
import { t } from '@i18n';
import { fetchPlayerHistory } from '@api/players';
import { PlayerHistoryCard } from '@components/TF2';
import { Search, TextItem } from '@components/General';

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
      <TextItem
        fontSize="h1"
        className="relative text-3xl font-bold text-center my-5"
      >
        {t('PLAYERHISTORY')}
      </TextItem>
      <Search
        placeholder={t('PLAYER_SEARCH')}
        className="ml-4 mb-3 w-[calc(100%-40px)]"
        onChange={handleSearch}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 custom-scollbar overflow-x-hidden max-h-[calc(100vh-120px)]">
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
