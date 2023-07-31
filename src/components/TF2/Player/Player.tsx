import React from 'react';
import './Player.css';

import { t } from '@i18n';
import { updatePlayer } from '@api/players';
import { PopoutInfo } from '@components/TF2';
import { ContextMenu, Select } from '@components/General';
import { ContextMenuContext } from '@components/General/ContextMenu/ContextMenuProvider';
import { hexToRGB } from '@api/utils';

const localVerdict = [
  {
    label: 'PLAYER',
    value: 'Player',
  },
  {
    label: 'BOT',
    value: 'Bot',
  },
  {
    label: 'CHEATER',
    value: 'Cheater',
  },
  {
    label: 'SUSPICIOUS',
    value: 'Suspicious',
  },
  {
    label: 'TRUSTED',
    value: 'Trusted',
  },
];

function displayProperVerdict(verdict: string) {
  if (verdict.toLowerCase() === 'none') return t('PLAYER');

  const option = localVerdict.find((option) => option.value === verdict);

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

function displayColor(
  playerColors: Record<string, string>,
  player: PlayerInfo,
) {
  const ALPHA = '0.35';
  const you = player.isSelf;
  const verdict = player.localVerdict!;

  const { convicted } = player;

  if (you) return hexToRGB(playerColors['You'], ALPHA);

  if (!verdict || verdict.includes('None') || verdict.includes('Player'))
    return hexToRGB(playerColors['Player'], ALPHA);

  if (convicted) return hexToRGB(playerColors['Cheater'], ALPHA);

  return hexToRGB(playerColors[verdict], ALPHA);
}

interface PlayerProps {
  player: PlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
  playerColors?: Record<string, string>;
}

const Player = ({
  player,
  icon,
  className,
  onImageLoad,
  playerColors,
}: PlayerProps) => {
  // Context Menu
  const { showMenu } = React.useContext(ContextMenuContext);
  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : displayProperVerdict(player.localVerdict ?? t('PLAYER'));
  const displayTime = formatTime(player.gameInfo?.time ?? 0);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';
  const color = displayColor(playerColors!, player);

  const localizedLocalVerdict = localVerdict.map((verdict) => ({
    label: t(verdict.label),
    value: verdict.value,
  }));

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const menuItems = [
      {
        label: 'Open Profile',
        onClick: () => {
          parent.open(player.steamInfo?.profileUrl);
        },
      },
    ];

    /*if (!player.isSelf) {
      menuItems.push({
        label: 'Votekick Player',
        onClick: () => {
          console.log('Soon:tm:');
        },
      });
    }*/

    showMenu(event, menuItems);
  };

  return (
    <div
      className={`player-item ${className}`}
      style={{ backgroundColor: color }}
    >
      <Select
        className="player-verdict"
        options={localizedLocalVerdict}
        placeholder={displayVerdict}
        disabled={player.isSelf}
        onChange={(e) => updatePlayer(player.steamID64, e.toString())}
      />
      <PopoutInfo
        player={player}
        className="player-popout"
        key={player.steamID64}
      >
        <div className="player-profile" onContextMenu={handleContextMenu}>
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
        </div>
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
      <ContextMenu />
    </div>
  );
};

export default Player;
