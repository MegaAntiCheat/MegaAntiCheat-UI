import React, { Fragment } from 'react';
import { formatCreationDate } from '@api/utils';
import { BarChart, CircleSlash2, Crosshair, Info, Skull } from 'lucide-react';
import { t } from '@i18n';
import { Tooltip } from '@components/General';

import { PlayerImage } from '@components/TF2/Player/PlayerDetails/PlayerImage';
import { calculateKD } from '@components/TF2/Player/playerutils';
import PlayerNotebox from '@components/TF2/Player/Notes/PlayerNotebox';

interface PlayerDetailsProps {
  player: PlayerInfo;
  bgColor?: string;
}

const PlayerDetails = ({ player, bgColor }: PlayerDetailsProps) => {
  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const daysSinceLastBan = player.steamInfo?.daysSinceLastBan;

  return (
    <Fragment>
      <div className="h-[1px] bg-highlight/40" />

      <div
        className="playerdetails h-min w-full content-center align-middle"
        style={{ backgroundColor: bgColor }}
      >
        <div className="relative top-1 mx-1.5 grid grid-cols-playerdetails rounded-[3px] rounded-b-none bg-secondary/50 p-2.5">
          <PlayerImage
            steamID64={player.steamID64}
            pfp={player.steamInfo?.pfp}
            size={128}
            className={'outline'}
          />

          <div className="grid grid-cols-playerdetailscontent overflow-x-auto">
            <div className="relative flex content-center items-center">
              <div className="text-start">
                <div className="flex">
                  <div className="mr-1 font-semibold">{t('ACC_CREATION')}:</div>
                  {formatCreationDate(player.steamInfo?.timeCreated ?? 0)}
                </div>

                <div className="flex">
                  <div className="mr-1 font-semibold"> {t('COUNTRY')}:</div>
                  {player?.steamInfo?.countryCode ?? t('UNKNOWN')}
                </div>
                <div className="flex">
                  <div className="mr-1 font-semibold">VAC Bans:</div>
                  <div>{vacBans}</div>
                  {!!vacBans && (
                    <Tooltip
                      content={`Last ban ${
                        daysSinceLastBan
                          ? `${daysSinceLastBan} days`
                          : 'some time'
                      } ago`}
                    >
                      <Info
                        color="grey"
                        className="relative bottom-0.5 ml-1"
                        width={14}
                        height={14}
                      />
                    </Tooltip>
                  )}
                </div>
                <div className="flex">
                  <div className="mr-1 font-semibold">{t('GAME')} Bans:</div>
                  <div>{gameBans}</div>
                  {!!gameBans && (
                    <Tooltip
                      content={`Last ban ${
                        daysSinceLastBan
                          ? `${daysSinceLastBan} days`
                          : 'some time'
                      } ago`}
                    >
                      <Info
                        color="grey"
                        className="relative bottom-0.5 ml-1"
                        width={14}
                        height={14}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full w-[1px] bg-highlight/30" />
            <div className="flex select-none flex-wrap justify-center text-start">
              <div className="gamestats whitespace-nowrap">
                <Crosshair width={18} height={18} />
                <div className="ml-1.5 flex">
                  <div className="mr-1 font-semibold">{t('KILLS')}:</div>
                  <div>{player.gameInfo.kills ?? 0}</div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <Skull width={18} height={18} />
                </div>
                <div className="ml-1.5 flex whitespace-nowrap">
                  <div className="mr-1 font-semibold"> {t('DEATHS')}:</div>
                  <div>{player.gameInfo.deaths ?? 0}</div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <CircleSlash2 width={16} height={16} />
                </div>
                <div className="ml-1.5 flex whitespace-nowrap">
                  <div className="mr-1 font-semibold">K/D:</div>
                  <div>
                    {calculateKD(player.gameInfo.kills, player.gameInfo.deaths)}
                  </div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <BarChart width={18} height={18} />
                </div>
                <div className="ml-1.5 flex whitespace-nowrap">
                  <div className="mr-1 font-semibold">{t('PING')}:</div>
                  <div>{player.gameInfo.ping ?? 0}ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bottom-1 mx-[6px] mt-2 content-normal rounded-b-[3px] bg-secondary/50 pb-2">
          <PlayerNotebox player={player} />
        </div>
      </div>
    </Fragment>
  );
};

export default PlayerDetails;
