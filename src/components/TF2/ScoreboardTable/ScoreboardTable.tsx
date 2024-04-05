import React from 'react';
import './ScoreboardTable.css';

import { getAllSettings } from '@api/preferences';
import { Player } from '@components/TF2';
import { t } from '@i18n';
import { ContextMenuProvider } from '@context';
import { SearchRelevance } from '../../../Pages/PlayerHistory/PlayerHistory';
import { ArrowUpFromDot } from 'lucide-react';

interface ScoreboardTableProps {
  players: Map<string, PlayerInfo[]>
  extraDataHeader: string
  columnSpacing: string
  //TODO: eslint whatever the fuck
  buildPlayer: (player: any) => React.JSX.Element
}

const ScoreboardTable = ({
  players,
  extraDataHeader,
  columnSpacing,
  buildPlayer
}: ScoreboardTableProps) => {
  const renderTeam = (team: PlayerInfo[], teamName: string) => {

    // Subtract amount of disconnected players from the actual playercount
    const amountDisconnected = team.filter(
      (player) => player.gameInfo?.state === "Disconnected"
    ).length;

    return (
      // Keep the classname for the popoutinfo alignment
      <div className={`scoreboard-grid-half pb-[10px] ${teamName}`}>
        <div
          className={`text-4xl font-build mt-4 mb-1 ${teamName?.toLowerCase()}`}
        >
          {t(teamName).toUpperCase()} (
          {team.length - amountDisconnected})
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
          {team.map((p) => (
            // Provide the Context Menu Provider to the Element
            <ContextMenuProvider key={p.steamID64}>
              {buildPlayer(p)}
            </ContextMenuProvider>
          ))}
        </div>
      </div>
    );
  };

  let getDefaultLayout = function(data: Map<string, PlayerInfo[]>): React.JSX.Element[] {
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
