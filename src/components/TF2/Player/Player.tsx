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
import PlayerDetails from './LivePlayerDetails';

import { verifyImageExists } from '@api/utils';
import { kickPlayer } from '@api/commands';
import { Info } from 'lucide-react';
import { useModal } from '../../../Context';
import ChangeAliasModal from './Modals/ChangeAliasModal';
import { executionAsyncResource } from 'async_hooks';

interface PlayerProps {
  steamID64: string;
  verdict: string;
  name?: string;
  image?: string;
  className?: string;
  onImageLoad?: () => void;
  onVerdictChange?: (newVerdict: string) => string | undefined; // Returns color
  bgColor?: string;
  grayedOut?: boolean;
  openInApp?: boolean;
  columnSpacing: string;
  note?: React.JSX.Element;
  icons: React.ReactNode[];
  details: React.JSX.Element;
  extraData: string; // Text that appears in final column
  extraMenuItems: MenuItem[];
}

const Player = ({
  steamID64,
  verdict,
  name,
  image,
  className,
  onImageLoad,
  onVerdictChange,
  bgColor,
  grayedOut,
  openInApp,
  columnSpacing,
  note,
  icons,
  details,
  extraData,
  extraMenuItems
}: PlayerProps) => {
  // Context Menu
  const { showMenu } = React.useContext(ContextMenuContext);

  // Modal
  const { openModal } = useModal();

  // States
  const [showPlayerDetails, setShowPlayerDetails] = React.useState(false);

  const urlToOpen = openInApp
    ? `steam://url/SteamIDPage/${steamID64}`
    : `https://steamcommunity.com/profiles/${steamID64}`;

  // Use "Player" as a verdict if the client isnt You
  const displayVerdict = verdict === "Self"
    ? t('YOU')
    : verdict === "Convict"
    ? t('CONVICT')
    : localizeVerdict(verdict);

  const displayName = name || steamID64;

  // const color = displayColor(playerColors!, player, cheatersInLobby);

  const [color, setColor] = React.useState<string | undefined>(
    bgColor
  );

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

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    let menuItems: MenuItem[] = [
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
            onClick: () => navigator.clipboard.writeText(name ?? steamID64),
          },
          {
            label: 'SteamID64',
            onClick: () => navigator.clipboard.writeText(steamID64),
          },
        ],
      },
      {
        label: 'Change Alias',
        onClick: () =>
          openModal(<ChangeAliasModal steamID64={steamID64} />, {
            dismissable: true,
          }),
      },
    ];

    menuItems.push(...extraMenuItems);

    showMenu(event, menuItems);
  };

  return (
    <>
      <div
        className={`player-item items-center py-0.5 px-1 grid grid-cols-${columnSpacing}sm xs: grid-cols-${columnSpacing} hover:bg-highlight/5 ${
          showPlayerDetails ? 'expanded' : ''
        } ${className}`}
        id={`player-display-div-${steamID64}`}
        style={{
          backgroundColor: color,
        }}
      >
        <Select
          className="player-verdict"
          options={localizedLocalVerdictOptions}
          placeholder={displayVerdict}
          disabled={["SELF", "CONVICT"].includes(verdict)}
          onChange={(e) => {
            // Immediately update local instance
            // Causes new info to immediately show
            const newColor = onVerdictChange?.(e.toString());
            updatePlayer(steamID64, e.toString());
            setColor(newColor);
          }}
        />
        <div onClick={() => setShowPlayerDetails(!showPlayerDetails)}>
          <div
            className="flex ml-1 cursor-pointer select-none"
            key={steamID64}
            onContextMenu={handleContextMenu}
          >
            <img
              className="rounded-s-sm mx-3 cursor-pointer"
              width={24}
              height={24}
              src={image}
              alt="Profile"
              onLoad={onImageLoad}
              style={{ filter: grayedOut ? 'grayscale(100%)' : 'inherit' }}
            />
            <div
              className={`text-ellipsis overflow-hidden whitespace-nowrap select-none ${
                grayedOut ? 'grayedOut' : ''
              }`}
            >
              {displayName}
            </div>
            {note}
          </div>
        </div>
        <div
          className={`flex flex-wrap justify-center bottom-[1px] relative ml-1 ${
            grayedOut ? 'grayedOut' : ''
          }`}
        >
          {icons}
        </div>
        {/* <div
          className={`player-status hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            grayedOut ? 'grayedOut' : ''
          }`}
        >
          {displayStatus}
        </div> */}
        
        <div
          className={`player-time hidden xs:[display:unset]  text-ellipsis overflow-hidden whitespace-nowrap ${
            (grayedOut) ? 'grayedOut' : ''
          }`}
        >
          {extraData}
        </div>
        <ContextMenu />
      </div>
      <div>
        {showPlayerDetails && details}
      </div>
    </>
  );
};

export default Player;
