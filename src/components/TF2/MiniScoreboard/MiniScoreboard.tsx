import React from 'react';
import './MiniScoreboard.css';

interface MiniScoreboardProps {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}
interface Verdicts {
  suspicious: PlayerInfo[];
  cheating: PlayerInfo[];
  convicted: PlayerInfo[];
}

interface MSBContentProps {
  verdicts: Verdicts;
  team: string;
}

function calculateSusAndCheater(players: PlayerInfo[]): Verdicts {
  const cheating = players?.filter(
    (player) =>
      player.localVerdict?.toLowerCase() === 'cheater' ||
      player.localVerdict?.toLowerCase() === 'bot' ||
      player.convicted,
  );
  const suspicious = players?.filter(
    (player) => player.localVerdict?.toLowerCase() === 'suspicious',
  );

  const convicted = players?.filter((player) => player.convicted);

  return { suspicious, cheating, convicted };
}

const MiniScoreboardContent = ({ verdicts, team }: MSBContentProps) => {
  return (
    <>
      <div className={`miniscore-team ${team}`}>{team.toUpperCase()}</div>
      <div className="miniscore-team-container">
        <div className="miniscore-text">
          Cheating:{' '}
          <div className={`miniscore-num ${team}`}>
            {verdicts.cheating.length}
          </div>
        </div>
        <div className="miniscore-text">
          Suspicious:
          <div className={`miniscore-num ${team}`}>
            {verdicts.suspicious.length}
          </div>
        </div>
      </div>
    </>
  );
};

const MiniScoreboard = ({ RED, BLU }: MiniScoreboardProps) => {
  const verdictsRED = calculateSusAndCheater(RED ?? []);
  const verdictsBLU = calculateSusAndCheater(BLU ?? []);

  return (
    <>
      <div className="miniscore-container">
        {RED && <MiniScoreboardContent verdicts={verdictsRED} team="red" />}
        {BLU && <MiniScoreboardContent verdicts={verdictsBLU} team="blu" />}
      </div>
    </>
  );
};

export default MiniScoreboard;
