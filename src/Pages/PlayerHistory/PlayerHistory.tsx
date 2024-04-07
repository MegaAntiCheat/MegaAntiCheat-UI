import React from 'react';
import { useMinimode } from '@context';
import { MiniScoreboard, ScoreboardTable } from '@components/TF2';
import './PlayerHistory.css';
import ArchiveTable from '@components/TF2/ArchiveTable/ArchiveTable';
import { fetchArchivedPlayers, fetchRecentPlayers } from '@api/players';
import { t } from '@i18n';
import { stringify } from 'querystring';
import Search from '@components/General/Search/Search';
import Checkbox from '@components/General/Checkbox/Checkbox';

// Maps Steam IDs of each search result to its relevance
export type SearchRelevance = Map<string, string>;

const PlayerHistory = () => {

  const [data, setData] = React.useState<{recent: ArchivePlayerInfo[], archive: ArchivePlayerInfo[]}>({ recent: [], archive: []});
  const [RECENT, setRecent] = React.useState<ArchivePlayerInfo[]>([]);
  const [ARCHIVE, setArchive] = React.useState<ArchivePlayerInfo[]>([]);

  const [query, setQuery] = React.useState<string>(' ');
  const [caseSensitive, setCaseSensitive] = React.useState<boolean>(false);

  const defaultSort = (a: ArchivePlayerInfo, b: ArchivePlayerInfo) => {
    return b.steamID64.localeCompare(a.steamID64);
  }

  const handleSearch = (query: string) => {
    setQuery(query);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const newRecentDataPromise = fetchRecentPlayers();
      const newArchiveDataPromise = fetchArchivedPlayers();
      setData({
        recent: await newRecentDataPromise,
        archive: await newArchiveDataPromise
      })
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

    if(query.trim() !== '') {
      newRecent = search(newRecent, query, caseSensitive);
      newArchive = search(newArchive, query, caseSensitive);
    } else {
      newRecent.sort(defaultSort);
      newArchive.sort(defaultSort);
    }
    setRecent(newRecent);
    setArchive(newArchive);
  }, [data, query, caseSensitive]);

  return (
    <>
      <div className='flex'>
        <Search
          placeholder={t('PLAYER_SEARCH')}
          className="ml-4 mt-3 mb-3 w-[calc(100%-200px)]"
          onChange={handleSearch}
        />
        <Checkbox
          className="case-sensitive-checkbox ml-4 mt-3 mb-3 h-4 items-center"
          onChange={setCaseSensitive}
        />
        <p className='items-center ml-4 mt-3 mb-3 h-4'>{t('CASE_SENSITIVE')}</p>
      </div>
      <div className="playerlist-max">
        
          <ArchiveTable
            RECENT={RECENT}
            ARCHIVE={ARCHIVE}
          />
        
      </div>
    </>
  );
};

type SearchFunction = {f: (p: ArchivePlayerInfo) => boolean, note: string};

// Filters, sorts, and appends the "relevance" property to the player info.
function search(data: ArchivePlayerInfo[], query: string, caseSensitive: boolean): ArchivePlayerInfo[] {
  let out = [...data]; // Avoid modifying input as it's part of a useState
  let relevance = new Map<string, {value: number, note: string}>();
  const lQuery = query.toLowerCase();

  // All the predicates for searching via text query.
  // The earlier the first true predicate is in this list, the higher it will appear in the search results.
  // Many functions have case sensitive variants that can be toggled by the user.
  const searchPredicates: SearchFunction[] = [
    {f: (p) => query === p.steamID64, note: 'SEARCH_REL_STEAMID'}, // Exact SteamID // TODO: Handle SteamID3 and SteamID2 results

    {f: (p) => caseSensitive && query === p.customData.alias, note: 'SEARCH_REL_CUSTOMNAME_EXACT_CASE'}, // Exact custom alias
    {f: (p) => lQuery === p.customData.alias?.toLowerCase(), note: 'SEARCH_REL_CUSTOMNAME_EXACT'},

    {f: (p) => caseSensitive && query === p.name, note: 'SEARCH_REL_NAME_EXACT_CASE'}, // Exact current alias
    {f: (p) => lQuery === p.name.toLowerCase(), note: 'SEARCH_REL_NAME_EXACT'},

    {f: (p) => caseSensitive && (p.previousNames?.includes(query) ?? false), note: 'SEARCH_REL_PREVNAME_EXACT_CASE'}, // Exact previous alias
    {f: (p) => p.previousNames?.some(n => lQuery === n.toLowerCase()) ?? false, note: 'SEARCH_REL_PREVNAME_EXACT'},

    {f: (p) => caseSensitive && (p.customData.alias?.startsWith(query) ?? false), note: 'SEARCH_REL_CUSTOMNAME_START_CASE'}, // Start of custom alias
    {f: (p) => p.customData.alias?.toLowerCase().startsWith(lQuery) ?? false, note: 'SEARCH_REL_CUSTOMNAME_START'},

    {f: (p) => caseSensitive && p.name.startsWith(query), note: 'SEARCH_REL_NAME_START_CASE'}, // Start of current alias
    {f: (p) => p.name.toLowerCase().startsWith(lQuery), note: 'SEARCH_REL_NAME_START'},

    {f: (p) => caseSensitive && (p.previousNames?.some(n => n.startsWith(query)) ?? false), note: 'SEARCH_REL_PREVNAME_START_CASE'}, // Start of previous alias
    {f: (p) => (p.previousNames?.some(n => n.toLowerCase().startsWith(lQuery)) ?? false), note: 'SEARCH_REL_PREVNAME_START'},

    {f: (p) => caseSensitive && (p.customData.alias?.includes(query) ?? false), note: 'SEARCH_REL_CUSTOMNAME_SUB_CASE'}, // Substring of custom alias
    {f: (p) => p.customData.alias?.toLowerCase().includes(lQuery) ?? false, note: 'SEARCH_REL_CUSTOMNAME_SUB'},

    {f: (p) => caseSensitive && p.name.includes(query), note: 'SEARCH_REL_NAME_SUB_CASE'}, // Substring of current alias
    {f: (p) => p.name.toLowerCase().includes(lQuery), note: 'SEARCH_REL_NAME_SUB'},

    {f: (p) => caseSensitive && (p.previousNames?.some(n => n.includes(query)) ?? false), note: 'SEARCH_REL_PREVNAME_SUB_CASE'}, // Substring of previous alias
    {f: (p) => (p.previousNames?.some(n => n.toLowerCase().includes(lQuery)) ?? false), note: 'SEARCH_REL_PREVNAME_SUB'},
  ]

  const getRelevance = function (p: ArchivePlayerInfo): number {
    for(let i = 0; i < searchPredicates.length; i++) {
      if(searchPredicates[i].f(p)) {
        relevance.set(p.steamID64, {value: i, note: t(searchPredicates[i].note)});
        return i;
      }
    }
    //relevance.set(p.steamID64, t("SEARCH_REL_NONE"));
    return -1;
  }

  out.forEach(p => getRelevance(p));

  return out
    .filter((p) => relevance.has(p.steamID64))
    .sort((a, b) => {
      return relevance.get(a.steamID64)!.value - relevance.get(b.steamID64)!.value;
    })
    .map(p => {
      return {
        searchRelevance: relevance.get(p.steamID64)?.note,
        ...p
      };
    })
}

export default PlayerHistory;
