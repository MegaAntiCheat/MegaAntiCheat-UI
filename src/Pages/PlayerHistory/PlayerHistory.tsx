import React, { useState } from 'react';
import { t } from '@i18n';
import { fetchRecentPlayers } from '@api/players';
import { PlayerHistoryCard, ScoreboardTable } from '@components/TF2';
import { Search, TextItem } from '@components/General';

import './PlayerHistory.css';

const PlayerHistory = () => {
  const [allRecent, setAllRecent] = useState<PlayerInfo[]>([]);
  const [filteredRecent, setFilteredRecent] = useState<PlayerInfo[]>([]);
  const [allArchive, setAllArchive] = useState<PlayerInfo[]>([]);
  const [filteredArchive, setFilteredArchive] = useState<PlayerInfo[]>([]);
  const [query, setQuery] = useState<string>('');

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      const recentDataPromise = fetchRecentPlayers();
      //const archiveDataPromise = fetchArchivedPlayers();
      setAllRecent(await recentDataPromise);
      //setAllArchive(await archiveDataPromise);
    };

    fetchHistoryData();
  }, []);

  React.useEffect(() => {
    if (query.trim() === '') {
      setFilteredRecent(allRecent);
      setFilteredArchive(allArchive);
    } else {
      setFilteredRecent(allRecent.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase()),
      ));
      setFilteredArchive(allArchive.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase()),
      ));
    }
  }, [query]);

  const handleSearch = (query: string) => {
    setQuery(query);
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
            ["RECENT", filteredRecent],
            ["ARCHIVE", filteredArchive]
        ])}
          LIVE={false}
        />
      </div>
    </>
  );
};

export default PlayerHistory;
