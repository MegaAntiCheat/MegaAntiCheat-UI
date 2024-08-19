import React, { Fragment } from 'react';
import './PlayerHistory.css';
import ArchiveTable from '@components/TF2/ArchiveTable/ArchiveTable';
import { fetchArchivedPlayers, fetchRecentPlayers } from '@api/players';
import { getSteamID64 } from '@api/steamid';
import { PlayerHistorySearchArea } from './components/PlayerHistorySearchArea';
import { search } from '@lib/utils'; // Maps Steam IDs of each search result to its relevance

// Maps Steam IDs of each search result to its relevance
export type SearchRelevance = Map<string, string>;

const PlayerHistory = () => {
  const [data, setData] = React.useState<{
    recent: ArchivePlayerInfo[];
    archive: ArchivePlayerInfo[];
  }>({ recent: [], archive: [] });
  const [RECENT, setRecent] = React.useState<ArchivePlayerInfo[]>([]);
  const [ARCHIVE, setArchive] = React.useState<ArchivePlayerInfo[]>([]);

  const [query, setQuery] = React.useState<string>(' ');
  const [caseSensitive, setCaseSensitive] = React.useState<boolean>(false);

  const [playerToAdd, setPlayerToAdd] = React.useState<string | undefined>(
    undefined,
  );

  // Tracks which results the user is currently refreshing.
  const [refreshing, setRefreshing] = React.useState<string[]>([]);

  const archiveSort = (a: ArchivePlayerInfo, b: ArchivePlayerInfo) => {
    return b.steamID64.localeCompare(a.steamID64);
  };

  const handleSearch = (query: string) => {
    setQuery(query);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (refreshing.length > 0) return;
      const [newRecentData, newArchiveData] = [
        await fetchRecentPlayers(),
        await fetchArchivedPlayers(),
      ];
      if (refreshing.length > 0) return;
      setData({
        recent: newRecentData,
        archive: newArchiveData,
      });
    };

    // First Render: Refresh the data Immediately without having to wait for the interval
    fetchData();

    const intervalHandle = setInterval(fetchData, 3000);

    return () => {
      clearInterval(intervalHandle);
    };
  }, []);

  React.useEffect(() => {
    let newRecent = [...data.recent];
    let newArchive = [...data.archive];

    if (query.trim() !== '') {
      newRecent = search(newRecent, query, caseSensitive);
      newArchive = search(newArchive, query, caseSensitive);

      const query64 = getSteamID64(query.trim());
      const result =
        query64 &&
        query64 === query &&
        ![newRecent, newArchive].flat().some((p) => p.steamID64 === query64)
          ? query64
          : undefined;
      console.log(result);
      setPlayerToAdd(result);
    } else {
      // newRecent is already sorted in the desired order (most recent first)
      newArchive.sort(archiveSort);
      setPlayerToAdd(undefined);
    }
    setRecent(newRecent);
    setArchive(newArchive);
  }, [data, query, caseSensitive]);

  return (
    <Fragment>
      <PlayerHistorySearchArea
        handleSearch={handleSearch}
        playerToAdd={playerToAdd}
        caseSensitive={caseSensitive}
        setCaseSensitive={setCaseSensitive}
      />

      <ArchiveTable
        RECENT={RECENT}
        ARCHIVE={ARCHIVE}
        query={query}
        refresh={[refreshing, setRefreshing]}
      />
    </Fragment>
  );
};

export default PlayerHistory;
