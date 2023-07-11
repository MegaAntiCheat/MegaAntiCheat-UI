import React from 'react';
import './MiniScoreboard.css';
import { Flex } from '../../General';

interface MiniScoreboard {
  RED?: PlayerInfo[];
  BLU?: PlayerInfo[];
}

function calculateSusAndCheater(players: PlayerInfo[]): {
  suspicious: number;
  cheating: number;
  total: number;
} {
  let cheating = 0;
  let suspicious = 0;

  for (const player of players) {
    if (player.verdict?.toLowerCase() === 'suspicious') suspicious++;
    if (player.verdict?.toLowerCase() === 'cheater') cheating++;
  }

  return { suspicious, cheating, total: cheating + suspicious };
}

const MiniScoreboard = ({ RED, BLU }: MiniScoreboard) => {
  const verdictsRED = calculateSusAndCheater(RED ?? []);
  const verdictsBLU = calculateSusAndCheater(BLU ?? []);

  return (
    <>
      <div className="miniscore-container">
        <div className="blu miniscore-team">BLU</div>
        <Flex className="miniscore-team-container">
          <div className="miniscore-text">Cheating:</div>
          <div className="miniscore-value blu">{verdictsBLU.cheating}</div>
          <div className="miniscore-text">Suspicious:</div>
          <div className="miniscore-value blu">{verdictsBLU.suspicious}</div>
          <div className="miniscore-text">Total:</div>
          <div className="miniscore-value blu">{verdictsBLU.total}</div>
        </Flex>
        <div className="red miniscore-team">RED</div>
        <Flex className="miniscore-team-container">
          <div className="miniscore-text">Cheating</div>
          <div className="miniscore-value red">{verdictsRED.cheating}</div>
          <div className="miniscore-text">Suspicious</div>
          <div className="miniscore-value red">{verdictsRED.suspicious}</div>
          <div className="miniscore-text">Total</div>
          <div className="miniscore-value red">{verdictsRED.total}</div>
        </Flex>
      </div>
    </>
  );
};

export default MiniScoreboard;
