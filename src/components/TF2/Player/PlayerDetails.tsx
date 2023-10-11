import React from 'react';
import { formatCreationDate, verifyImageExists } from '@api/utils';
import {
  BarChart,
  CheckCircle,
  CircleSlash2,
  Crosshair,
  Info,
  RefreshCw,
  SendHorizonal,
  Skull,
  XCircle,
} from 'lucide-react';
import { calculateKD } from './playerutils';
import { t } from '@i18n';
import { Search, Tooltip } from '@components/General';
import { updatePlayer } from '@api/players';

interface PlayerDetailsProps {
  player: PlayerInfo;
  bgColor?: string;
}

enum SentState {
  IDLE = 0,
  SENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

const PlayerDetails = ({ player, bgColor }: PlayerDetailsProps) => {
  const [pfp, setPfp] = React.useState('./person.webp');
  const [playerNote, setPlayerNote] = React.useState(
    player.customData.playerNote,
  );

  const [noteSentStatus, setNoteSentStatus] = React.useState<SentState>(
    SentState.IDLE,
  );

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
        className="playerdetails h-min w-full align-middle content-center"
        style={{ backgroundColor: bgColor }}
      >
        <div className=" bg-secondary/50 grid grid-cols-playerdetails p-2.5 mx-1.5 top-1 relative rounded-[3px] rounded-b-none">
          <img
            className="outline outline-highlight/60 outline-1"
            src={pfp}
            width={128}
            height={128}
          />
          <div className="grid grid-cols-playerdetailscontent overflow-x-auto">
            <div className="relative flex items-center content-center">
              <div className="text-start">
                <div className="flex">
                  <div className="font-semibold mr-1">{t('ACC_CREATION')}:</div>
                  {formatCreationDate(player.steamInfo?.timeCreated ?? 0)}
                </div>

                <div className="flex">
                  <div className="font-semibold mr-1"> {t('COUNTRY')}: </div>
                  {player?.steamInfo?.countryCode ?? t('UNKNOWN')}
                </div>
                <div className="flex">
                  <div className="font-semibold mr-1">VAC Bans: </div>
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
                  <div className="font-semibold mr-1">{t('GAME')} Bans: </div>
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
            <div className="h-full bg-highlight/30 w-[1px]" />
            <div className="select-none flex flex-wrap text-start justify-center">
              <div className="gamestats whitespace-nowrap">
                <Crosshair width={18} height={18} />
                <div className="ml-1.5 flex">
                  <div className="font-semibold mr-1">{t('KILLS')}: </div>
                  <div>{player.gameInfo.kills ?? 0}</div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <Skull width={18} height={18} />
                </div>
                <div className="ml-1.5 whitespace-nowrap flex">
                  <div className="font-semibold mr-1"> {t('DEATHS')}: </div>
                  <div>{player.gameInfo.deaths ?? 0}</div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <CircleSlash2 width={16} height={16} />
                </div>
                <div className="ml-1.5 whitespace-nowrap flex">
                  <div className="font-semibold mr-1">K/D: </div>
                  <div>
                    {calculateKD(player.gameInfo.kills, player.gameInfo.deaths)}
                  </div>
                </div>
              </div>
              <div className="gamestats">
                <div className="gamestat-icon">
                  <BarChart width={18} height={18} />
                </div>
                <div className="ml-1.5 whitespace-nowrap flex">
                  <div className="font-semibold mr-1">{t('PING')}: </div>
                  <div>{player.gameInfo.ping ?? 0}ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-[6px] pb-2 mt-2 bottom-1 content-normal bg-secondary/50 relative rounded-b-[3px]">
          <div className="flex mx-2.5 items-center relative">
            <Search
              className="relative w-full mr-1"
              placeholder="Add Player Note"
              value={playerNote}
              onChange={(e) => setPlayerNote(e)}
            />
            <div
              className="hover:cursor-pointer"
              onClick={async () => {
                setNoteSentStatus(SentState.SENDING);

                try {
                  const res = await updatePlayer(player.steamID64, undefined, {
                    playerNote: playerNote,
                  });

                  if (!res) throw new Error('Failed to Update player note');

                  setNoteSentStatus(SentState.SUCCESS); // Success
                } catch (e) {
                  setNoteSentStatus(SentState.FAILED); // Failed
                }

                setTimeout(() => {
                  setNoteSentStatus(0); // Idle
                }, 3000);
              }}
            >
              {noteSentStatus === 0 && (
                <SendHorizonal
                  className="p-1 hover:bg-secondary rounded"
                  width={40}
                  height={40}
                />
              )}
              {noteSentStatus === 1 && (
                <RefreshCw
                  className="p-1 rounded animate-spin"
                  width={40}
                  height={40}
                />
              )}
              {noteSentStatus === 2 && (
                <CheckCircle
                  className="p-1 hover:bg-secondary rounded"
                  color="green"
                  width={40}
                  height={40}
                />
              )}
              {noteSentStatus === 3 && (
                <XCircle
                  className="p-1 hover:bg-secondary rounded"
                  color="red"
                  width={40}
                  height={40}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetails;
