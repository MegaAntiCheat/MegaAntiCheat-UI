import React from 'react';
import './Player.css';

import { t } from '@i18n';
import { updatePlayer } from '@api/players';
import { ContextMenu, Select, Tooltip } from '@components/General';
import { ContextMenuContext, MenuItem } from '../../../Context';
import {
  buildIconList,
  displayColor,
  displayNamesList,
  displayProperStatus,
  formatTimeToString,
  localizeVerdict,
  makeLocalizedVerdictOptions,
} from './playerutils';
import PlayerDetails from './PlayerDetails';

import { verifyImageExists } from '@api/utils';
import { kickPlayer } from '@api/commands';
import { Info } from 'lucide-react';
import { useModal } from '../../../Context';
import ChangeAliasModal from './Modals/ChangeAliasModal';

interface PlayerProps {
  player: PlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
  playerColors?: Record<string, string>;
  openInApp?: boolean;
  userSteamID?: string;
}

const Player = ({
  player,
  className,
  onImageLoad,
  playerColors,
  openInApp,
}: PlayerProps) => {
  const isFirstRefresh = React.useRef(true);
  // Context Menu
  const { showMenu } = React.useContext(ContextMenuContext);

  // Modal
  const { openModal } = useModal();

  // States
  const [playtime, setPlaytime] = React.useState(0);
  const [pfp, setPfp] = React.useState<string>('./person.webp');
  const [showPlayerDetails, setShowPlayerDetails] = React.useState(false);

  const urlToOpen = openInApp
    ? `steam://url/SteamIDPage/${player.steamID64}`
    : player.steamInfo?.profileUrl;

  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : localizeVerdict(player.localVerdict);
  const displayTime = formatTimeToString(playtime);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const displayName = player.customData?.alias ?? player.name;
  const color = displayColor(playerColors!, player);

  const localizedLocalVerdictOptions = makeLocalizedVerdictOptions();

  const { disconnected } = player.gameInfo;

  // Prevent text selection on click (e.g Dropdown)
  React.useEffect(() => {
    function preventDefault(e: MouseEvent) {
      if (e.detail != 2) return;

      e.preventDefault();
    }
    document.addEventListener('mousedown', preventDefault);

    return () => document.removeEventListener('mousedown', preventDefault);
  }, []);

  // Update playtime on mount
  React.useEffect(() => {
    if (!isFirstRefresh.current) return;

    setPlaytime(player.gameInfo?.time ?? 0);
    isFirstRefresh.current = false;
    console.log(urlToOpen);
  }, [player.gameInfo?.time]);

  // Update playtime every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player.gameInfo.disconnected) return;
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
    const menuItems: MenuItem[] = [
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
      {
        label: 'Change Alias',
        onClick: () =>
          openModal(<ChangeAliasModal player={player} />, {
            dismissable: true,
          }),
      },
    ];

    if (!disconnected) {
      menuItems.push({
        label: 'Votekick Player',
        multiOptions: [
          {
            label: 'Cheating',
            onClick: () => kickPlayer(player.gameInfo.userid, 'cheating'),
          },
          {
            label: 'Scamming',
            onClick: () => kickPlayer(player.gameInfo.userid, 'scamming'),
          },
          {
            label: 'Idle',
            onClick: () => kickPlayer(player.gameInfo.userid, 'idle'),
          },
          {
            label: 'No Reason',
            onClick: () => kickPlayer(player.gameInfo.userid, 'none'),
          },
        ],
      });
    }

    showMenu(event, menuItems);
  };

  return (
    <>
      <div
        className={`player-item items-center py-0.5 px-1 grid grid-cols-playersm xs:grid-cols-player hover:bg-highlight/5 ${
          showPlayerDetails ? 'expanded' : ''
        } ${className}`}
        style={{
          backgroundColor: color,
        }}
      >
        <Select
          className="player-verdict"
          options={localizedLocalVerdictOptions}
          placeholder={displayVerdict}
          disabled={player.isSelf}
          onChange={(e) => {
            updatePlayer(player.steamID64, e.toString());
            // Immediately update local instance
            // Causes new info to immediately show
            player.localVerdict = e.toString();
          }}
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
              style={{ filter: disconnected ? 'grayscale(100%)' : 'inherit' }}
            />
            <div
              className={`text-ellipsis overflow-hidden whitespace-nowrap select-none xs:select-all ${
                disconnected ? 'greyscale' : ''
              }`}
            >
              {displayName}
            </div>
            {(player.previousNames?.filter((v) => v != player.customData?.alias)
              .length ?? 0) >= 1 && (
              <Tooltip
                className="ml-1 bottom-[1px] mr-3"
                content={displayNamesList(player)}
              >
                <Info color="grey" width={16} height={16} />
              </Tooltip>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center bottom-[1px] relative">
          {buildIconList(player)}
        </div>
        <div
          className={`player-status hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            disconnected ? 'greyscale' : ''
          }`}
        >
          {displayStatus}
        </div>
        <div
          className={`player-time hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            disconnected ? 'greyscale' : ''
          }`}
        >
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
