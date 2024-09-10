import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import './Player.css';

import { t } from '@i18n';
import { updatePlayer } from '@api/players';
import { ContextMenu, Select, Tooltip } from '@components/General';
import { ContextMenuContext, MenuItem } from '@context';
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
import { useModal } from '@context';
import ChangeAliasModal from './Modals/ChangeAliasModal';
import {
  convertSteamID64toSteamID2,
  convertSteamID64toSteamID3,
} from '@api/steamid';
import { profileLinks } from '../../../constants/playerConstants';

interface PlayerProps {
  player: PlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
  playerColors?: Record<string, string>;
  openInApp?: boolean;
  userSteamID?: string;
  cheatersInLobby: PlayerInfo[];
}

const Player = ({
  player,
  className,
  onImageLoad,
  playerColors,
  openInApp,
  cheatersInLobby,
}: PlayerProps) => {
  const isFirstRefresh = useRef(true);
  // Context Menu
  const { showMenu } = useContext(ContextMenuContext);

  // Modal
  const { openModal } = useModal();

  // States
  const [playtime, setPlaytime] = useState(0);
  const [pfp, setPfp] = useState<string>('./person.webp');
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);

  const urlToOpen = openInApp
    ? `steam://url/SteamIDPage/${player.steamID64}`
    : `https://steamcommunity.com/profiles/${player.steamID64}`;

  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : localizeVerdict(player.localVerdict);
  const displayTime = formatTimeToString(playtime);
  const displayStatus = displayProperStatus(player.gameInfo!.state!);
  const displayName = player.customData?.alias || player.name;

  // const color = displayColor(playerColors!, player, cheatersInLobby);

  const [color, setColor] = useState<string | undefined>(
    displayColor(playerColors!, player, cheatersInLobby),
  );

  useEffect(() => {
    setColor(displayColor(playerColors!, player, cheatersInLobby));
  }, [player.localVerdict, playerColors, player, cheatersInLobby]);

  const localizedLocalVerdictOptions = makeLocalizedVerdictOptions();

  const disconnected = displayStatus === 'Disconnected';

  // Prevent text selection on click (e.g Dropdown)
  useEffect(() => {
    function preventDefault(e: globalThis.MouseEvent) {
      if (e.detail != 2) return;

      e.preventDefault();
    }
    document.addEventListener('mousedown', preventDefault);

    return () => document.removeEventListener('mousedown', preventDefault);
  }, []);

  // Sync time if not yet set or out of sync (e.g. switched servers)
  useEffect(() => {
    if (
      !isFirstRefresh.current &&
      Math.abs(playtime - (player.gameInfo?.time ?? playtime)) <= 3
    ) {
      return;
    }

    setPlaytime(player.gameInfo?.time ?? 0);
    isFirstRefresh.current = false;
  }, [player.gameInfo?.time]);

  // Update playtime every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (disconnected) return;
      setPlaytime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [disconnected]);

  // Update pfp on mount
  useEffect(() => {
    if (!player.steamInfo?.pfp) return;

    verifyImageExists(player.steamInfo?.pfp, './person.webp').then((src) => {
      setPfp(src);

      if (onImageLoad) onImageLoad();
    });
  }, [player.steamInfo?.pfp]);

  const formatUrl = (url: string) => {
    url = url.replace('{{ID64}}', player.steamID64);
    return url;
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const menuItems: MenuItem[] = [
      {
        label: 'Open Profile',
        multiOptions: [
          {
            label: 'Steam Profile',
            onClick: () => parent.open(urlToOpen, '_blank'),
          },
          ...profileLinks.map(([name, url]) => ({
            label: name,
            onClick: () => parent.open(formatUrl(url), '_blank'),
          })),
        ],
        onClick: () => {
          parent.open(urlToOpen, '_blank');
        },
      },
      {
        label: 'Copy...',
        multiOptions: [
          {
            label: `Name: ${player.name}`,
            onClick: () => navigator.clipboard.writeText(player.name),
          },
          {
            label: `SteamID64: ${player.steamID64}`,
            onClick: () => navigator.clipboard.writeText(player.steamID64),
          },
          {
            label: `SteamID3: ${convertSteamID64toSteamID3(player.steamID64)}`,
            onClick: () =>
              navigator.clipboard.writeText(
                convertSteamID64toSteamID3(player.steamID64),
              ),
          },
          {
            label: `SteamID2: ${convertSteamID64toSteamID2(player.steamID64)}`,
            onClick: () =>
              navigator.clipboard.writeText(
                convertSteamID64toSteamID2(player.steamID64),
              ),
          },
          {
            label: `UserID: ${player.gameInfo.userid}`,
            onClick: () =>
              navigator.clipboard.writeText(player.gameInfo.userid),
          },
        ],
      },
      {
        label: 'Change Alias',
        onClick: () =>
          openModal(
            <ChangeAliasModal
              steamID64={player.steamID64}
              name={player.customData.alias ?? player.name}
            />,
            {
              dismissable: true,
            },
          ),
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
        id={`player-display-div-${player.steamID64}`}
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
            // Immediately update local instance
            // Causes new info to immediately show
            player.localVerdict = e.toString();
            updatePlayer(player.steamID64, e.toString());
            setColor(displayColor(playerColors!, player, cheatersInLobby));
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
              className={`text-ellipsis overflow-hidden whitespace-nowrap select-none ${
                disconnected ? 'disconnected' : ''
              }`}
            >
              {displayName}
            </div>
            {(player.previousNames?.filter((v) => v != player.customData?.alias)
              .length ?? 0) >= 1 && (
              <Tooltip
                className="ml-1 bottom-[1px]"
                content={displayNamesList(player)}
              >
                <Info color="grey" width={16} height={16} />
              </Tooltip>
            )}
          </div>
        </div>
        <div
          className={`flex flex-wrap justify-center bottom-[1px] relative ml-1 ${
            disconnected ? 'disconnected' : ''
          }`}
        >
          {buildIconList(player, cheatersInLobby)}
        </div>
        {/* <div
          className={`player-status hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            disconnected ? 'disconnected' : ''
          }`}
        >
          {displayStatus}
        </div> */}
        <div
          className={`player-time hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            disconnected ? 'disconnected' : ''
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
