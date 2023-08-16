import React from 'react';
import './Player.css';

import { t } from '@i18n';
import { updatePlayer } from '@api/players';
import { ContextMenu, Select } from '@components/General';
import { ContextMenuContext } from '@components/General/ContextMenu/ContextMenuProvider';
import {
  displayColor,
  displayProperStatus,
  formatTime,
  localizeVerdict,
  makeLocalizedVerdictOptions,
} from './playerutils';
import { verifyImageExists } from '@api/utils';
import PlayerDetails from './PlayerDetails';

interface PlayerProps {
  player: PlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
  playerColors?: Record<string, string>;
  openInApp?: boolean;
}

const Player = ({
  player,
  icon,
  className,
  onImageLoad,
  playerColors,
  openInApp,
}: PlayerProps) => {
  const isFirstRefresh = React.useRef(true);
  // Context Menu
  const { showMenu } = React.useContext(ContextMenuContext);

  // States
  const [playtime, setPlaytime] = React.useState(0);
  const [pfp, setPfp] = React.useState<string>('./person.webp');
  const [showPlayerDetails, setShowPlayerDetails] = React.useState(false);

  const urlToOpen = openInApp
    ? `steam://url/SteamIDPage/id/${player.steamID64}`
    : player.steamInfo?.profileUrl;

  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : localizeVerdict(player.localVerdict);
  const displayTime = formatTime(playtime);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const color = displayColor(playerColors!, player);

  const localizedLocalVerdictOptions = makeLocalizedVerdictOptions();

  // Update playtime on mount
  React.useEffect(() => {
    if (!isFirstRefresh.current) return;

    setPlaytime(player.gameInfo?.time ?? 0);
    isFirstRefresh.current = false;
  }, [player.gameInfo?.time]);

  // Update playtime every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaytime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update pfp on mount
  React.useEffect(() => {
    if (!player.steamInfo?.pfp) return;

    verifyImageExists(player.steamInfo?.pfp, './person.webp').then((src) => {
      setPfp(src);

      if (onImageLoad) onImageLoad();
    });
  }, [player.steamInfo?.pfp]);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const menuItems = [
      {
        label: 'Open Profile',
        onClick: () => {
          parent.open(urlToOpen, '_blank');
        },
      },
      {
        label: 'Copy SteamID64',
        onClick: () => navigator.clipboard.writeText(player.steamID64),
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
    <>
      <div
        className={`player-item items-center py-0.5 px-1 grid grid-cols-playersm xs:grid-cols-player hover:bg-highlight/5 ${
          showPlayerDetails ? 'expanded' : ''
        } ${className}`}
        style={{ backgroundColor: color }}
      >
        <Select
          className="player-verdict"
          options={localizedLocalVerdictOptions}
          placeholder={displayVerdict}
          disabled={player.isSelf}
          onChange={(e) => updatePlayer(player.steamID64, e.toString())}
        />
        <div onClick={() => setShowPlayerDetails(!showPlayerDetails)}>
          <div
            className="flex ml-1 cursor-pointer select-none"
            key={player.steamID64}
            onContextMenu={handleContextMenu}
          >
            <img
              className="rounded-s-sm mx-3 cursor-pointer"
              width={24}
              height={24}
              src={pfp}
              alt="Profile"
              onLoad={onImageLoad}
            />
            <div className="text-ellipsis overflow-hidden whitespace-nowrap select-none xs:select-all">
              {player.name}
            </div>
          </div>
        </div>
        {icon ? (
          <img
            className="player-badge mr-5"
            width={12}
            height={12}
            src={icon}
            alt="Badge"
          />
        ) : (
          <div />
        )}
        <div className="player-status hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap">
          {displayStatus}
        </div>
        <div className="player-time hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap">
          {displayTime}
        </div>
        <ContextMenu />
      </div>
      <div>
        {showPlayerDetails && (
          <>
            <div className="bg-highlight/40 h-[1px]" />
            <PlayerDetails player={player} bgColor={color} />
          </>
        )}
      </div>
    </>
  );
};

export default Player;
