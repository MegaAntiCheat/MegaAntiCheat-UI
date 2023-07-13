import React from 'react';
import './Player.css';

import { Flex, Select } from '@components/General';
import { markPlayer } from '@api';

const localVerdict = [
  {
    name: 'Player',
    value: 'player',
  },
  {
    name: 'Bot',
    value: 'bot',
  },
  {
    name: 'Cheater',
    value: 'cheater',
  },
  {
    name: 'Suspicious',
    value: 'suspicious',
  },
  {
    name: 'Trusted',
    value: 'trusted',
  },
];

function displayProperVerdict(verdict: string) {
  if (verdict.toLowerCase() === 'none') return 'Player';

  const option = localVerdict.find(
    (option) => option.value === verdict.toLowerCase(),
  );
  return option ? option.name : 'Player';
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function displayProperStatus(status: string) {
  if (status === 'Active') return 'In-Game';
  return 'Joining';
}

interface Player {
  player: PlayerInfo;
  icon?: string;
  className?: string;
}

const Player = ({ player, icon, className }: Player) => {
  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? 'You'
    : displayProperVerdict(player.verdict ?? 'Player');
  const displayTime = formatTime(player.gameInfo?.time ?? 0);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';

  return (
    <Flex className={`player-item ${className}`}>
      <Select
        className="player-verdict"
        options={localVerdict}
        placeholder={displayVerdict}
        disabled={player.isSelf}
        onChange={(e) => markPlayer(player.steamID64, e.toString())}
      />
      <Flex className="player-profile">
        <img
          className="player-pfp"
          width={24}
          height={24}
          src={pfp}
          alt="Profile"
        />
        <div className="player-name">{player.name}</div>
      </Flex>
      {icon ? (
        <img
          className="player-badge"
          width={12}
          height={12}
          src={icon}
          alt="Badge"
        />
      ) : (
        <div />
      )}
      <div className="player-status">{displayStatus}</div>
      <div className="player-time">{displayTime}</div>
    </Flex>
  );
};

export default Player;
