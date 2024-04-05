import React from 'react';
import './ScoreboardTable.css';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { t } from '@i18n';
import { ContextMenuProvider } from '@context';
import { SearchRelevance } from '../../../Pages/PlayerHistory/PlayerHistory';
import { ArrowUpFromDot } from 'lucide-react';

interface ScoreboardTableProps {
  players: Map<string, Map<string, React.JSX.Element>>
  extraDataHeader: string
  columnSpacing: string
}

const ScoreboardTable = ({
  players,
  extraDataHeader,
  columnSpacing
}: ScoreboardTableProps) => {
  const renderTeam = (team: Map<string, React.JSX.Element>, teamName: string) => {
    const teamEntries = Array.from(team.entries());
    // Subtract amount of disconnected players from the actual playercount
    // const amountDisconnected = teamEntries.filter(
    //   (player) => player.props.grayedOut,
    // ).length;

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half pb-[10px] ${teamName}`}>
        <div
          className={`text-4xl font-build mt-4 mb-1 ${teamName?.toLowerCase()}`}
        >
          {t(teamName).toUpperCase()} (
          {team.size})
        </div>
        <div className={`flex-1 ml-5 mb-2 text-start font-build grid grid-cols-scoreboardnav${columnSpacing}sm xs:grid-cols-scoreboardnav${columnSpacing}`}>
          <div>{t('TEAM_NAV_RATING')}</div>
          <div>{t('TEAM_NAV_USER')}</div>
          {/* <div className="hidden xs:[display:unset]">
            {t('TEAM_NAV_STATUS')}
          </div> */}
          <div className="hidden xs:[display:unset]">{t(extraDataHeader)}</div>
        </div>
        <div className={`${teamName?.toLowerCase()}`}>
          {teamEntries.map((e) => (
            // Provide the Context Menu Provider to the Element
            <ContextMenuProvider key={e[0]}>
              {e[1]}
            </ContextMenuProvider>
          ))}
        </div>
      </div>
    );
  };

  let getDefaultLayout = function(data: Map<string, Map<string, React.JSX.Element>>): React.JSX.Element[] {
    let entries = Array.from(data.entries());
    let out = [];
    for(let i = 0; i < data.size; i++) {
      if (i % 2 == 1) {
        out.push(<>
          <div className="scoreboard-divider lg:[display:block] h-auto bg-highlight/10 w-[1px] mt-0" />
        </>)
      }
      out.push(renderTeam(entries[i][1], entries[i][0]))
    }
    return out;
  }

  return (
    <div className="grid grid-cols-scoreboardgridsm lg:grid-cols-scoreboardgrid place-content-start text-center h-screen overflow-x-hidden">
      {getDefaultLayout(players)}
    </div>
  );
};

export default ScoreboardTable;
