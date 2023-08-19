import React from 'react';
import { formatCreationDate, verifyImageExists } from '@api/utils';
import { BarChart, CircleSlash2, Crosshair, Info, Skull } from 'lucide-react';
import { calculateKD } from './playerutils';
import { t } from '@i18n';
import { Tooltip } from '@components/General';

interface PlayerDetailsProps {
  player: PlayerInfo;
  bgColor?: string;
}

const PlayerDetails = ({ player, bgColor }: PlayerDetailsProps) => {
  const [pfp, setPfp] = React.useState('./person.webp');

  const vacBans = player.steamInfo?.vacBans ?? 0;
  const gameBans = player.steamInfo?.gameBans ?? 0;
  const daysSinceLastBan = player.steamInfo?.daysSinceLastBan;
  // Update pfp on mount
  React.useEffect(() => {
    if (!player.steamInfo?.pfp) return;

    verifyImageExists(player.steamInfo?.pfp, './person.webp').then((src) => {
      setPfp(src);
    });
  }, [player.steamInfo?.pfp]);

  return (
    <>
      <div
        className="playerdetails h-40 w-full"
        style={{ backgroundColor: bgColor }}
      >
        <div className=" bg-secondary/50 grid grid-cols-playerdetails p-2.5 top-1.5 mx-1.5 relative rounded-[3px]">
          <img
            className="outline outline-highlight/60 outline-1"
            src={pfp}
            width={128}
            height={128}
          />
          <div className="grid grid-cols-playerdetailscontent overflow-x-auto">
            <div className="relative flex items-center content-center">
              <div className="text-start">
                <div>
                  {t('ACC_CREATION')}:{' '}
                  {formatCreationDate(player.steamInfo?.timeCreated ?? 0)}
                </div>

                <div>
                  {t('COUNTRY')}:{' '}
                  {player?.steamInfo?.countryCode ?? t('UNKNOWN')}
                </div>
                <div className="flex">
                  VAC Bans: {vacBans}{' '}
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
                  {t('GAME')} Bans: {gameBans}
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
            <div className="h-full bg-highlight/30 w-[1px]" />
            <div className="select-none flex flex-wrap text-start justify-center">
              <div className="gamestats whitespace-nowrap">
                <Crosshair width={18} height={18} />
                <div className="ml-1.5">
                  {t('KILLS')}: {player.gameInfo.kills ?? 0}
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <Skull width={18} height={18} />
                </div>
                <div className="ml-1.5 whitespace-nowrap">
                  {t('DEATHS')}: {player.gameInfo.deaths ?? 0}
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <CircleSlash2 width={16} height={16} />
                </div>
                <div className="ml-1.5 whitespace-nowrap">
                  K/D:{' '}
                  {calculateKD(player.gameInfo.kills, player.gameInfo.deaths)}
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <BarChart width={18} height={18} />
                </div>
                <div className="ml-1.5 whitespace-nowrap">
                  {t('PING')}: {player.gameInfo.ping ?? 0}ms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetails;
