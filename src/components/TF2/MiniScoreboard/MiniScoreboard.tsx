import React from 'react';
import './MiniScoreboard.css';
import { Flex } from '@components/General';

interface MiniScoreboardProps {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}
interface Verdicts {
  suspicious: number;
  cheating: number;
  total: number;
}

interface MSBContentProps {
  verdicts: Verdicts;
  team: string;
}

function calculateSusAndCheater(players: PlayerInfo[]): Verdicts {
  let cheating = 0;
  let suspicious = 0;

  for (const player of players) {
    if (player.localVerdict?.toLowerCase() === 'suspicious') suspicious++;
    if (player.localVerdict?.toLowerCase() === 'cheater') cheating++;
  }

  return { suspicious, cheating, total: cheating + suspicious };
}

const MiniScoreboardContent = ({ verdicts, team }: MSBContentProps) => {
  return (
    <>
      <div className={`miniscore-team ${team}`}>{team.toUpperCase()}</div>
      <Flex className="miniscore-team-container">
        <div className="miniscore-text">Cheating:</div>
        <div className={`miniscore-value ${team}`}>{verdicts.cheating}</div>
        <div className="miniscore-text">Suspicious:</div>
        <div className={`miniscore-value ${team}`}>{verdicts.suspicious}</div>
      </Flex>
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
