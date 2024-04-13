import React from 'react';
import './Player.css';

import { t } from '@i18n';
import { updatePlayer, updateSteamInfo } from '@api/players';
import { ContextMenu, Select, Tooltip } from '@components/General';
import { ContextMenuContext, MenuItem } from '../../../Context';
import {
  buildIconList,
  buildIconListFromArchive,
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
import ArchivePlayerDetails from './ArchivePlayerDetails';

interface ArchivePlayerProps {
  player: ArchivePlayerInfo;
  icon?: string;
  className?: string;
  onImageLoad?: () => void;
  playerColors?: Record<string, string>;
  openInApp?: boolean;
  userSteamID?: string;
  cheatersInLobby: ArchivePlayerInfo[];
  isRefreshing: boolean,
  setRefreshing: (b: boolean) => void
}

const ArchivePlayer = ({
  player,
  className,
  onImageLoad,
  playerColors,
  openInApp,
  cheatersInLobby,
  isRefreshing,
  setRefreshing
}: ArchivePlayerProps) => {
  // Context Menu
  const { showMenu } = React.useContext(ContextMenuContext);

  // Modal
  const { openModal } = useModal();

  // States
  const [pfp, setPfp] = React.useState<string>('./person.webp');
  const [showPlayerDetails, setShowPlayerDetails] = React.useState(false);

  const urlToOpen = openInApp
    ? `steam://url/SteamIDPage/${player.steamID64}`
    : `https://steamcommunity.com/profiles/${player.steamID64}`;

  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = player.isSelf
    ? t('YOU')
    : localizeVerdict(player.localVerdict);
  const displayName = player.customData?.alias || player.name;

  // const color = displayColor(playerColors!, player, cheatersInLobby);

  const [color, setColor] = React.useState<string | undefined>(
    displayColor(playerColors!, player, cheatersInLobby),
  );

  React.useEffect(() => {
    setColor(displayColor(playerColors!, player, cheatersInLobby));
  }, [player.localVerdict, playerColors, player, cheatersInLobby]);

  const localizedLocalVerdictOptions = makeLocalizedVerdictOptions();

  // Prevent text selection on click (e.g Dropdown)
  React.useEffect(() => {
    function preventDefault(e: MouseEvent) {
      if (e.detail != 2) return;

      e.preventDefault();
    }
    document.addEventListener('mousedown', preventDefault);

    return () => document.removeEventListener('mousedown', preventDefault);
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
        label: 'Copy...',
        multiOptions: [
          {
            label: 'Name',
            onClick: () => navigator.clipboard.writeText(player.name),
          },
          {
            label: 'SteamID64',
            onClick: () => navigator.clipboard.writeText(player.steamID64),
          },
        ],
      },
      {
        label: 'Change Alias',
        onClick: () =>
          openModal(<ChangeAliasModal steamID64={player.steamID64} name={player.customData.alias ?? player.name}/>, {
            dismissable: true,
          }),
      },
      {
        label: 'Refresh Data',
        onClick: () => {
          setRefreshing(true);
          updateSteamInfo([player.steamID64]).then(() => {
            setRefreshing(false);
          });
        }
      },
    ];

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
              style={{ filter: 'inherit' }}
            />
            <div
              className={`text-ellipsis overflow-hidden whitespace-nowrap select-none`}
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
          className={`flex flex-wrap justify-center bottom-[1px] relative ml-1`}
        >
          {buildIconListFromArchive(player, cheatersInLobby, isRefreshing, setRefreshing)}
        </div>
        {/* <div
          className={`player-status hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            disconnected ? 'disconnected' : ''
          }`}
        >
          {displayStatus}
        </div> */}
        <div
          className={`player-time hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap`}
        >
          {player.searchRelevance}
        </div>
        <ContextMenu />
      </div>
      <div>
        {showPlayerDetails && (
          <>
            <div className="bg-highlight/40 h-[1px]" />
            <ArchivePlayerDetails player={player} bgColor={color} />
          </>
        )}
      </div>
    </>
  );
};

export default ArchivePlayer;
