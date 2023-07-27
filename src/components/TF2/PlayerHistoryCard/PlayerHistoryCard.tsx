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

  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;

  const displayVerdict = formVerdict(player.localVerdict);
  const displayAccCreation = formatCreationDate(timeCreated);
  const profileVisibility = formVisibility(player.steamInfo?.profileVisibility);

  return (
    <div
      className="phc-container"
      key={player.steamID64}
      ref={playerHistoryRef}
    >
      <div className="phc-left">
        <img
          width={128}
          height={128}
          src={pfp}
          alt="Profile Picture"
          className="phc-pfp"
        />
      </div>
      <div className="phc-content">
        <div className="phc-name">
          <a
            href={player.steamInfo?.profileUrl}
            target="_blank"
            className="redirect"
          >
            <div>{player.name}</div>
          </a>
          {profileVisibility.includes(t('PRIVATE')) && (
            <Tooltip content={t('TOOLTIP_PRIVATE')} direction="bottom">
              <EyeOff
                color="grey"
                className="phc-private"
                aria-label="Private"
              />
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
                className="phc-badge"
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
                className="phc-badge"
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
