import React, { useState } from 'react';
import { t } from '@i18n';
import { fetchPlayerHistory } from '@api/players';
import { PlayerHistoryCard, ScoreboardTable } from '@components/TF2';
import { Search, TextItem } from '@components/General';

import './PlayerHistory.css';

const PlayerHistory = () => {
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [recentResults, setRecentResults] = useState<PlayerInfo[]>([]);
  const [archiveResults, setArchiveResults] = useState<PlayerInfo[]>([]);

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      const newData = await fetchPlayerHistory();
      setRecentResults(newData);
      setArchiveResults([]);
    };

    fetchHistoryData();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setRecentResults(players);
    } else {
      const filteredResults = players.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase()),
      );
      setRecentResults(filteredResults);
    }
  };

  return (
    <>
      <Search
        placeholder={t('PLAYER_SEARCH')}
        className="ml-4 mt-3 mb-3 w-[calc(100%-40px)]"
        onChange={handleSearch}
      />
      <div className="playerlist-max">
        <ScoreboardTable
          DATA = {new Map<string, PlayerInfo[]>([
            ["RECENT", recentResults],
            ["ARCHIVE", archiveResults]
        ])}
        />
      </div>
    </>
  );
};

export default PlayerHistory;
