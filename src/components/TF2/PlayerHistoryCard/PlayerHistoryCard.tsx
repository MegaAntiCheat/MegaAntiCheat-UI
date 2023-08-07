import React from 'react';
import { Tooltip } from '@components/General';
import { AlertOctagon, EyeOff, ShieldAlert } from 'lucide-react';
import './PlayerHistoryCard.css';
import { t } from '@i18n';

interface PlayerHistoryCardProps {
  player: PlayerInfo;
}

function formatCreationDate(timeCreated: number): string {
  if (!timeCreated) return t('UNKNOWN');

  const unixTimestamp = timeCreated * 1000;
  const date = new Date(unixTimestamp);

  if (isNaN(date.getTime())) return t('UNKNOWN');

  return date.toLocaleDateString();
}

function formVerdict(verdict: string | undefined) {
  if (!verdict) return t('PLAYER');
  if (verdict.includes('None')) return t('PLAYER');
  return t(verdict.toUpperCase());
}

function formVisibility(visibility: profileVisibility | undefined) {
  switch (visibility) {
    case 1:
      return t('PRIVATE');
    case 2:
      return t('FRIENDS_ONLY');
    case 3:
      return t('PUBLIC');
    default:
      return t('PRIVATE');
  }
}

const PlayerHistoryCard = ({ player }: PlayerHistoryCardProps) => {
  const playerHistoryRef = React.useRef<HTMLDivElement>(null);

  const pfp = player.steamInfo?.pfp ?? './person.webp';
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;

  const displayVerdict = formVerdict(player.localVerdict);
  const displayAccCreation = formatCreationDate(timeCreated);
  const profileVisibility = formVisibility(player.steamInfo?.profileVisibility);

  return (
    <div
      className="mx-3 my-1 py-4 px-4 mx-full max-h-40 bg-secondary shadow-sm rounded-md flex space-x-4 text-ellipsis overflow-hidden whitespace-nowrap"
      key={player.steamID64}
      ref={playerHistoryRef}
    >
      <img
        width={128}
        height={128}
        src={pfp}
        alt="Profile Picture"
        className="block h-32 w-32 rounded-md outline outline-highlight/30 outline-1"
      />
      <div>
        <div className="flex text-3xl font-bold">
          <a
            href={player.steamInfo?.profileUrl}
            target="_blank"
            className="hover:text-sky-300 mr-2"
            rel="noreferrer"
          >
            <div className="">{player.name}</div>
          </a>
          {profileVisibility.includes(t('PRIVATE')) && (
            <Tooltip content={t('TOOLTIP_PRIVATE')} direction="bottom">
              <EyeOff color="grey" aria-label="Private" />
            </Tooltip>
          )}
        </div>
        <div className="phc-profile-info phc-created">
          {t('ACC_CREATION')}: {displayAccCreation}
        </div>
        <div className="phc-profile-info phc-verdict">{displayVerdict}</div>
        <div className="phc-details">
          <div className="phc-bans">
            {vacBans ? (
              <Tooltip
                className=""
                content={`${vacBans} VAC Ban${vacBans > 1 ? 's' : ''}`}
                direction="top"
              >
                <ShieldAlert
                  height={32}
                  width={32}
                  color="red"
                  textAnchor="Yea"
                />
              </Tooltip>
            ) : (
              <div />
            )}
            {gameBans ? (
              <Tooltip
                className=""
                content={`${gameBans} ${t('GAME')} Ban${
                  gameBans > 1 ? 's' : ''
                }`}
                direction="top"
              >
                <AlertOctagon
                  color={gameBans > 1 ? 'red' : 'darkorange'}
                  width={32}
                  height={32}
                />
              </Tooltip>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHistoryCard;
