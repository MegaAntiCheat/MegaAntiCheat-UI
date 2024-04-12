import React, { Suspense } from 'react';
import './ArchiveTable.css';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { t } from '@i18n';
import { ContextMenuProvider } from '@context';
import PageSelector from '@components/General/PageSelector/PageSelector';
import ArchivePlayer from '../Player/ArchivePlayer';

interface ArchiveTableProps {
  RECENT: ArchivePlayerInfo[];
  ARCHIVE: ArchivePlayerInfo[];
  query: string
}

const ArchiveTable = ({
  RECENT,
  ARCHIVE,
  query
}: ArchiveTableProps) => {
  // Store the users playerID
  const [userSteamID, setUserSteamID] = React.useState('0');
  const [playerSettings, setPlayerSettings] = React.useState<
    Settings['external']
  >({
    colors: {
      You: 'none',
      Player: 'none',
      Friend: 'none',
      Trusted: 'none',
      Suspicious: 'none',
      FriendOfCheater: 'none',
      Convict: 'none',
      Cheater: 'none',
      Bot: 'none',
    },
    openInApp: false,
  });

  React.useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const { external } = await getAllSettings(); // Replace this with the actual async function that fetches colors
        setPlayerSettings(external);
      } catch (error) {
        console.error('Error fetching team colors:', error);
      }
    };
    fetchTeamColors();
  }, []);

  React.useEffect(() => {
    const fetchSelf = () => {
      const combinedPlayers = RECENT?.concat(
        ARCHIVE ?? []
      );
      const self = combinedPlayers?.find((player) => player.isSelf);
      setUserSteamID(self?.steamID64 || '0');
    };

    fetchSelf(); // Initial fetch

    const interval = setInterval(() => {
      if (userSteamID !== '0') {
        clearInterval(interval); // We found our user, wipe timer
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [RECENT, ARCHIVE]);

  const renderTeam = (team: ArchivePlayerInfo[], teamName?: string) => {

    const combinedPlayers = RECENT.concat(ARCHIVE);

    const maxPerPage = 100;

    const cheaters = ARCHIVE.filter(
      (p) => p.convicted || ['Cheater', 'Bot'].includes(p.localVerdict ?? ''),
    );

    const totalPages = Math.ceil(team.length / maxPerPage); 
    const usePages = true;

    const [page, setPage] = React.useState<number>(1);
    
    React.useEffect(() => {
      setPage(1);
    }, [query]);

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half pb-[10px] ${teamName}`}>
        <div
          className={`text-4xl font-build mt-4 mb-1 ${teamName?.toLowerCase()}`}
        >
          {t(teamName ?? 'UNASSIGNED').toUpperCase()} (
          {team?.length})
        </div>
        <div
          className={`text-xl font-build mt-4 mb-1 ${teamName?.toLowerCase()}`}
        >
          {usePages && (<PageSelector
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />)}
        </div>
        <div className="flex-1 ml-5 mb-2 text-start font-build grid grid-cols-scoreboardnavsm xs:grid-cols-scoreboardnav">
          <div>{t('TEAM_NAV_RATING')}</div>
          <div>{t('TEAM_NAV_USER')}</div>
          {/* <div className="hidden xs:[display:unset]">
            {t('TEAM_NAV_STATUS')}
          </div> */}
          <div className="hidden xs:[display:unset]">{t('TEAM_NAV_TIME')}</div>
        </div>
        <div className={`${teamName?.toLowerCase()}`}>
          {team.filter((v, i) => {
            return i >= ( (page-1) * maxPerPage) && i < (page * maxPerPage)
          })
          .map((player) => (
            // Provide the Context Menu Provider to the Element
            <ContextMenuProvider key={player.steamID64}>
              <ArchivePlayer
                playerColors={playerSettings.colors}
                className={teamName?.toLowerCase()}
                player={player}
                key={player.steamID64}
                openInApp={playerSettings.openInApp}
                cheatersInLobby={cheaters}
              />
            </ContextMenuProvider>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-scoreboardgridsm lg:grid-cols-scoreboardgrid place-content-start text-center h-[calc(100vh-56px)] overflow-x-hidden">
      {renderTeam(RECENT, 'RECENT')}
      <div className="scoreboard-divider lg:[display:block] h-auto bg-highlight/10 w-[1px] mt-0" />
      {renderTeam(ARCHIVE, 'ARCHIVE')}
    </div>
  );
};

export default ArchiveTable;
