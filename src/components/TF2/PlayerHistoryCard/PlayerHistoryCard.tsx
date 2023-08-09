import React from 'react';
import { Tooltip } from '@components/General';
import { AlertOctagon, EyeOff, ShieldAlert, Users2 } from 'lucide-react';
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

const PlayerHistoryCard = ({ player }: PlayerHistoryCardProps) => {
  const playerHistoryRef = React.useRef<HTMLDivElement>(null);

  const pfp = player.steamInfo?.pfp ?? './person.webp';
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;

  const displayVerdict = formVerdict(player.localVerdict);
  const displayAccCreation = formatCreationDate(timeCreated);

  return (
    <div
      className="mx-3 my-1 py-4 px-4 mx-full max-h-40 bg-secondary shadow-sm rounded-md flex space-x-4 text-ellipsis overflow-x-auto overflow-y-hidden sm:overflow-hidden whitespace-nowrap"
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
            <div className="relative bottom-0.5">{player.name}</div>
          </a>
          {player.steamInfo?.profileVisibility === 1 /*Private*/ && (
            <Tooltip
              content={t('TOOLTIP_PRIVATE')}
              direction="bottom"
              className="bottom-0.5"
            >
              <EyeOff color="grey" aria-label="Private" />
            </Tooltip>
          )}
          {player.steamInfo?.profileVisibility === 2 /*Friends Only*/ && (
            <Tooltip
              content={t('FRIENDS_ONLY')}
              direction="bottom"
              className="bottom-0.5"
            >
              <Users2 color="grey" />
            </Tooltip>
          )}
        </div>
        <div className="text-gray-400">
          {t('ACC_CREATION')}: {displayAccCreation}
        </div>
        <div className="text-gray-400">{displayVerdict}</div>
        <div className="flex align-middle">
          <div className="relative mt-2.5">
            {vacBans ? (
              <Tooltip
                className="mr-2"
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
