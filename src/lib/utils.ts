// prettier-ignore
import {getSteamID64} from '@api/steamid';

// ----------------------------------[PLAYERS]--------------------------------------------
export const getDefaultOrImg = (img: string | undefined)  => {
 if (img) {
   return img;
 } else {
  return './person.webp';
 }
};


// ----------------------------------[SEARCH]---------------------------------------------
type SearchFunction = { f: (p: ArchivePlayerInfo) => boolean; note: string };

/**
 * Filters, sorts, and appends the "relevance" property to the player info.
 */

export function search(data: ArchivePlayerInfo[], query: string, caseSensitive: boolean): ArchivePlayerInfo[] {
  const out = [...data]; // Avoid modifying input as it's part of a useState
  const relevance = new Map<string, { value: number, note: string }>();
  const lQuery = query.toLowerCase();

  /**
   * All the predicates for searching via text query.
   * The earlier the first true predicate is in this list, the higher it will appear in the search results.
   * Many functions have case-sensitive variants that can be toggled by the user.
   * */
  const searchPredicates: SearchFunction[] = [
    {f: (p) => getSteamID64(query) === p.steamID64, note: 'SEARCH_REL_STEAMID'}, // Exact SteamID

    {f: (p) => caseSensitive && query === p.customData.alias,note: 'SEARCH_REL_CUSTOMNAME_EXACT_CASE'}, // Exact custom alias
    {f: (p) => lQuery === p.customData.alias?.toLowerCase(),note: 'SEARCH_REL_CUSTOMNAME_EXACT'},

    {f: (p) => caseSensitive && query === p.name, note: 'SEARCH_REL_NAME_EXACT_CASE'}, // Exact current alias
    {f: (p) => lQuery === p.name.toLowerCase(), note: 'SEARCH_REL_NAME_EXACT'},

    {f: (p) => caseSensitive && (p.previousNames?.includes(query) ?? false),note: 'SEARCH_REL_PREVNAME_EXACT_CASE'}, // Exact previous alias
    {f: (p) => p.previousNames?.some((n) => lQuery === n.toLowerCase()) ?? false,note: 'SEARCH_REL_PREVNAME_EXACT'},

    {f: (p) => caseSensitive && (p.customData.alias?.startsWith(query) ?? false),note: 'SEARCH_REL_CUSTOMNAME_START_CASE'}, // Start of custom alias
    {f: (p) => p.customData.alias?.toLowerCase().startsWith(lQuery) ?? false,note: 'SEARCH_REL_CUSTOMNAME_START'},

    {f: (p) => caseSensitive && p.name.startsWith(query),note: 'SEARCH_REL_NAME_START_CASE'}, // Start of current alias
    {f: (p) => p.name.toLowerCase().startsWith(lQuery), note: 'SEARCH_REL_NAME_START'},


    {f: (p) => caseSensitive && (p.previousNames?.some((n) => n.startsWith(query)) ?? false),note: 'SEARCH_REL_PREVNAME_START_CASE'}, // Start of previous alias
    {f: (p) => (p.previousNames?.some((n) => n.toLowerCase().startsWith(lQuery)) ?? false),note: 'SEARCH_REL_PREVNAME_START'},

    {f: (p) => caseSensitive && (p.customData.alias?.includes(query) ?? false),note: 'SEARCH_REL_CUSTOMNAME_SUB_CASE'}, // Substring of custom alias
    {f: (p) => p.customData.alias?.toLowerCase().includes(lQuery) ?? false,note: 'SEARCH_REL_CUSTOMNAME_SUB'},

    {f: (p) => caseSensitive && p.name.includes(query), note: 'SEARCH_REL_NAME_SUB_CASE'}, // Substring of current alias
    {f: (p) => p.name.toLowerCase().includes(lQuery), note: 'SEARCH_REL_NAME_SUB'},

    {f: (p) => caseSensitive && (p.previousNames?.some((n) => n.includes(query)) ?? false),note: 'SEARCH_REL_PREVNAME_SUB_CASE'}, // Substring of previous alias
    {f: (p) => (p.previousNames?.some((n) => n.toLowerCase().includes(lQuery)) ?? false),note: 'SEARCH_REL_PREVNAME_SUB'},
  ];

  const getRelevance = function (p: ArchivePlayerInfo): number {
    for (let i = 0; i < searchPredicates.length; i++) {
      if (searchPredicates[i].f(p)) {
        relevance.set(p.steamID64, {value: i, note: searchPredicates[i].note});
        return i;
      }
    }
    //relevance.set(p.steamID64, t("SEARCH_REL_NONE"));
    return -1;
  };

  out.forEach((p) => getRelevance(p));

  return out
    .filter((p) => relevance.has(p.steamID64))
    .sort((a, b) => {
      return relevance.get(a.steamID64)!.value - relevance.get(b.steamID64)!.value;
    })
    .map((p) => {
      return {
        ...p,
        searchRelevance: relevance.get(p.steamID64)?.note,
      };
    });
}
