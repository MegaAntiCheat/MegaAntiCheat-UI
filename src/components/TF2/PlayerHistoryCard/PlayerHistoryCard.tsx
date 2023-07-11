import React from 'react';
import './PlayerHistoryCard.css';
import { Tooltip } from '../../General';
import { AlertOctagon, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';

interface PlayerHistoryCard {
  player: PlayerInfo;
}

function formatCreationDate(timeCreated: number): string {
  if (!timeCreated) return 'Unknown';

  const unixTimestamp = timeCreated * 1000;
  const date = new Date(unixTimestamp);

  if (isNaN(date.getTime())) return 'Unknown';

  return date.toLocaleDateString();
}

function formVerdict(verdict: string | undefined) {
  if (!verdict) return 'Player';
  if (verdict === 'None') return 'Player';
  return verdict;
}

const PlayerHistoryCard = ({ player }: PlayerHistoryCard) => {
  const pfp = player.steamInfo?.pfp ?? './mac_logo.webp';
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;
  const displayAccCreation = formatCreationDate(timeCreated);
  const displayVerdict = formVerdict(player.verdict);
  const isPrivate = player.steamInfo?.profileVisibility === 'Private';

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
          <Tooltip content="This Profile is Private">
            <EyeOff color="grey" className="phc-private" />
          </Tooltip>
        )}
        <div className="phc-profile-info phc-created">
          Creation: {displayAccCreation}
        </div>
        <div className="phc-profile-info phc-verdict">{displayVerdict}</div>
        <div className="phc-details">
          <div className="phc-bans">
            {vacBans ? (
              <Tooltip
                className="phc-badge"
                content={`${vacBans} VAC Ban${
                  vacBans > 1 ? 's' : ''
                } on Record`}
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
                content={`${gameBans} Game Ban${gameBans > 1 ? 's' : ''}`}
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
