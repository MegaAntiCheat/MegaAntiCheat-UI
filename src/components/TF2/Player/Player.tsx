import React from 'react';
import './Player.css';

import { Flex, Select } from '@components/General';
import { PopoutInfo } from '@components/TF2';
import { markPlayer } from '@api/players';
import { t } from '@i18n';

const localVerdict = [
  {
    label: 'PLAYER',
    value: 'player',
  },
  {
    label: 'BOT',
    value: 'bot',
  },
  {
    label: 'CHEATER',
    value: 'cheater',
  },
  {
    label: 'SUSPICIOUS',
    value: 'suspicious',
  },
  {
    label: 'TRUSTED',
    value: 'trusted',
  },
];

function displayProperVerdict(verdict: string) {
  if (verdict.toLowerCase() === 'none') return t('PLAYER');

  const option = localVerdict.find(
    (option) => option.value === verdict.toLowerCase(),
  );

  return option ? t(option.label.toUpperCase()) : t('PLAYER');
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function displayProperStatus(status: string) {
  if (status === 'Active') return t('IN_GAME');
  return t('JOINING');
}

interface PlayerProps {
  player: PlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
}

const Player = ({ player, icon, className, onImageLoad }: PlayerProps) => {
  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : displayProperVerdict(player.localVerdict ?? t('PLAYER'));
  const displayTime = formatTime(player.gameInfo?.time ?? 0);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';

  const localizedLocalVerdict = localVerdict.map((verdict) => ({
    label: t(verdict.label),
    value: verdict.value,
  }));

  return (
    <Flex className={`player-item ${className}`}>
      <Select
        className="player-verdict"
        options={localizedLocalVerdict}
        placeholder={displayVerdict}
        disabled={player.isSelf}
        onChange={(e) => markPlayer(player.steamID64, e.toString())}
      />
      <PopoutInfo
        player={player}
        className="player-popout"
        key={player.steamID64}
      >
        <Flex className="player-profile">
          <img
            className="player-pfp"
            width={24}
            height={24}
            src={pfp}
            alt="Profile"
            onLoad={onImageLoad}
          />
          <div
            className="player-name"
            onClick={() => parent.open(player.steamInfo?.profileUrl)}
          >
            {player.name}
          </div>
        </Flex>
      </PopoutInfo>
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
