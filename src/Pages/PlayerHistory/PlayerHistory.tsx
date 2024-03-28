import React, { useState } from 'react';
import { t } from '@i18n';
import { fetchRecentPlayers } from '@api/players';
import { PlayerHistoryCard, ScoreboardTable } from '@components/TF2';
import { Checkbox, Search, TextItem } from '@components/General';

import './PlayerHistory.css';

// Maps Steam IDs of each search result to its relevance
export type SearchRelevance = Map<string, string>;

const PlayerHistory = () => {
  const [allRecent, setAllRecent] = useState<PlayerInfo[]>([]);
  const [filteredRecent, setFilteredRecent] = useState<PlayerInfo[]>([]);
  const [recentRelevance, setRecentRelevance] = useState<SearchRelevance>(new Map<string, string>());
  const [allArchive, setAllArchive] = useState<PlayerInfo[]>([]);
  const [filteredArchive, setFilteredArchive] = useState<PlayerInfo[]>([]);
  const [archiveRelevance, setArchiveRelevance] = useState<SearchRelevance>(new Map<string, string>());

  const [query, setQuery] = useState<string>(' ');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  React.useEffect(() => {
    const fetchHistoryData = async () => {
      const recentDataPromise = fetchRecentPlayers();
      //const archiveDataPromise = fetchArchivedPlayers();
      setAllRecent(await recentDataPromise);
      setFilteredRecent(await recentDataPromise)
      //setAllArchive(await archiveDataPromise);
    };

    fetchHistoryData();
  }, []);

  React.useEffect(() => {
    if (query.trim() === '') {
      setFilteredRecent(allRecent);
      setFilteredArchive(allArchive);
      setRecentRelevance(new Map<string, string>());
      setArchiveRelevance(new Map<string, string>());
      return;
    }
    let { results: recent, relevance: rRelevance } = search(allRecent, query, caseSensitive);
    let { results: archived, relevance: aRelevance } = search(allArchive, query, caseSensitive);

    setFilteredRecent(recent);
    setRecentRelevance(rRelevance);
    setFilteredArchive(archived);
    setArchiveRelevance(aRelevance);
    
  }, [query, caseSensitive]);

  const handleSearch = (query: string) => {
    setQuery(query);
  };

  return (
    <>
      <div className='flex'>
        <Search
          placeholder={t('PLAYER_SEARCH')}
          className="ml-4 mt-3 mb-3 w-[calc(100%-400px)]"
          onChange={handleSearch}
        />
        <Checkbox
          className="case-sensitive-checkbox ml-4 mt-3 mb-3 h-4 items-center"
          onChange={setCaseSensitive}
        />
        <p className='items-center ml-4 mt-3 mb-3 h-4'>{t('CASE_SENSITIVE')}</p>
      </div>
      <div className="playerlist-max">
        <ScoreboardTable
          DATA = {new Map<string, PlayerInfo[]>([
            ["RECENT", filteredRecent],
            ["ARCHIVE", filteredArchive]
        ])}
          RELEVANCE={new Map<string, SearchRelevance>([
            ["RECENT", recentRelevance],
            ["ARCHIVE", archiveRelevance]
        ])}
        />
      </div>
    </>
  );
};

type SearchFunction = {f: (p: PlayerInfo) => boolean, note: string};

// Filters, sorts, and appends the "relevance" property to the player info.
function search(data: PlayerInfo[], query: string, caseSensitive: boolean): { results: PlayerInfo[], relevance: SearchRelevance } {
  let out = [...data]; // Avoid modifying input as it's part of a useState
  let relevance = new Map<string, string>();
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

  const getRelevance = function (p: PlayerInfo): number {
    for(let i = 0; i < searchPredicates.length; i++) {
      if(searchPredicates[i].f(p)) {
        relevance.set(p.steamID64, t(searchPredicates[i].note));
        return i;
      }
    }
    //relevance.set(p.steamID64, t("SEARCH_REL_NONE"));
    return -1;
  }

  out.sort((a, b) => {
    return getRelevance(a) - getRelevance(b);
  });
  return { results: out.filter((p) => relevance.has(p.steamID64)), relevance };
}

export default PlayerHistory;
