import {
  Fragment,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { t } from '@i18n';
import { updatePlayer } from '@api/players';
import { ContextMenu, Select } from '@components/General';
import { ContextMenuContext, MenuItem, useModal } from '@context';
import {
  buildIconList,
  displayColor,
  displayProperStatus,
  formatTimeToString,
  localizeVerdict,
  makeLocalizedVerdictOptions,
} from './playerutils';
import { kickPlayer } from '@api/commands';
import ChangeAliasModal from './Modals/ChangeAliasModal';
import PlayerDetails from '@components/TF2/Player/PlayerDetails/PlayerDetails';
import { PlayerImgName } from '@components/TF2/Player/PlayerDetails/PlayerImgName';
import { PlayerTime } from '@components/TF2/Player/PlayerDetails/PlayerTime';

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
  playerColors,
  openInApp,
  cheatersInLobby,
}: PlayerProps) => {
  const isFirstRefresh = useRef(true);

  const { showMenu } = useContext(ContextMenuContext);
  const { openModal } = useModal();

  const [playtime, setPlaytime] = useState(0);
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

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
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
    <Fragment>
      <div
        className={`${showPlayerDetails ? 'expanded' : ''} ${className} grid grid-cols-4 items-center gap-4 py-0.5 hover:bg-highlight/5`}
        id={`player-display-div-${player.steamID64}`}
        style={{
          backgroundColor: color,
        }}
      >
        <Select
          className="bg-prange-500 min-w-[104px] max-w-[135px] pl-2"
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

        <PlayerImgName
          callback={() => setShowPlayerDetails(!showPlayerDetails)}
          player={player}
          handleContextMenu={handleContextMenu}
        />

        <span className="relative bottom-[1px] flex w-full justify-end overflow-clip">
          {buildIconList(player, cheatersInLobby)}
        </span>

        <PlayerTime disconnected={disconnected} displayTime={displayTime} />

        {/*TODO: what is this for?*/}
      </div>
      <ContextMenu />

      {showPlayerDetails && <PlayerDetails player={player} bgColor={color} />}
    </Fragment>
  );
};

export default Player;
