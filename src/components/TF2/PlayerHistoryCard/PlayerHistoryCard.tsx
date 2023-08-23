import React from 'react';
import { Select, Tooltip } from '@components/General';
import { AlertOctagon, EyeOff, ShieldAlert, Users2 } from 'lucide-react';
import './PlayerHistoryCard.css';
import { t } from '@i18n';
import { formatCreationDate, verifyImageExists } from '@api/utils';
import { makeLocalizedVerdictOptions } from '../Player/playerutils';
import { updatePlayer } from '@api/players';

interface PlayerHistoryCardProps {
  player: PlayerInfo;
}

function formVerdict(verdict: string | undefined) {
  if (!verdict) return t('PLAYER');
  if (verdict.includes('None')) return t('PLAYER');
  return t(verdict.toUpperCase());
}

const PlayerHistoryCard = ({ player }: PlayerHistoryCardProps) => {
  const playerHistoryRef = React.useRef<HTMLDivElement>(null);
  const [pfp, setPfp] = React.useState('./person.webp');

  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const timeCreated = player.steamInfo?.timeCreated ?? 0;

  const displayVerdict = formVerdict(player.localVerdict);
  const displayAccCreation = formatCreationDate(timeCreated);

  const verdictOptions = makeLocalizedVerdictOptions();

  // Update pfp on mount
  React.useEffect(() => {
    if (!player.steamInfo?.pfp) return;

    verifyImageExists(player.steamInfo?.pfp, './person.webp').then((src) => {
      setPfp(src);
    });
  }, [player.steamInfo?.pfp]);

  return (
    <div
      className="phc-wrapper relative mx-3 my-1 py-4 px-4 mx-full max-h-40 bg-secondary shadow-sm rounded-md flex space-x-4 text-ellipsis whitespace-nowrap overflow-x-auto overflow-y-auto"
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
          {player.steamInfo?.profileVisibility?.includes(
            'Private',
          ) /*Private*/ && (
            <Tooltip
              content={t('TOOLTIP_PRIVATE')}
              direction="bottom"
              className="bottom-0.5"
            >
              <EyeOff color="grey" aria-label="Private" />
            </Tooltip>
          )}
          {player.steamInfo?.profileVisibility?.includes('Friends Only') && (
            <Tooltip
              content={t('FRIENDS_ONLY')}
              direction="bottom"
              className="bottom-0.5"
            >
              <Users2 color="grey" />
            </Tooltip>
          )}
        </div>
        <div className="text-gray-400 relative bottom-1">
          {t('ACC_CREATION')}: {displayAccCreation}
        </div>
        <Select
          className="max-w-[120px] sticky z-30"
          options={verdictOptions}
          placeholder={displayVerdict}
          disabled={player.isSelf}
          onChange={(e) => updatePlayer(player.steamID64, e.toString())}
        />

        <div className="flex align-middle">
          <div className="relative mt-1.5">
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
