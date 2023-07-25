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
  if (verdict === 'None') return t('PLAYER');
  return verdict;
}

const PlayerHistoryCard = ({ player }: PlayerHistoryCardProps) => {
  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;
  const displayAccCreation = formatCreationDate(timeCreated);
  const displayVerdict = formVerdict(player.verdict);
  const isPrivate = player.steamInfo?.profileVisibility === t('PRIVATE');

  return (
    <div className="phc-container" key={player.steamID64}>
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
        <a
          href={player.steamInfo?.profileUrl}
          target="_blank"
          className="redirect"
        >
          <div className="phc-name">{player.name}</div>
        </a>
        {isPrivate && (
          <Tooltip content={t('TOOLTIP_PRIVATE')}>
            <EyeOff color="grey" className="phc-private" />
          </Tooltip>
        )}
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
