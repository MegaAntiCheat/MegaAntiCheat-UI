import React from 'react';
import { Search, Select, Tooltip } from '@components/General';
import { EyeOff, Users2 } from 'lucide-react';
import './AddPlayerModal.css';
import { t } from '@i18n';
import { formatCreationDate, verifyImageExists } from '@api/utils';
import { makeLocalizedVerdictOptions } from '../playerutils';
import { updatePlayer, updateSteamInfo } from '@api/players';
import { useModal } from '../../../../Context/ModalContext';

interface AddPlayerModalProps {
  steamID64: string;
}

const AddPlayerModal = ({ steamID64 }: AddPlayerModalProps) => {
  const playerHistoryRef = React.useRef<HTMLDivElement>(null);
  const [pfp, setPfp] = React.useState('./person.webp');

  const { closeModal } = useModal();

  // Null if we get an error fetching the data, undefined if we haven't tried yet.
  const [playerInfo, setPlayerInfo] = React.useState<
    PlayerInfo | null | undefined
  >(undefined);

  //const vacBans = playerInfo?.steamInfo?.vacBans ?? 0;
  //const gameBans = playerInfo?.steamInfo?.gameBans ?? 0;
  const timeCreated = playerInfo?.steamInfo?.timeCreated ?? 0;

  const [meetRequirements, setMeetRequirements] =
    React.useState<boolean>(false);
  const [parameters, setParameters] = React.useState<{
    verdict: string | undefined;
    customAlias: string | undefined;
    customNote: string | undefined;
  }>({
    verdict: undefined,
    customAlias: undefined,
    customNote: undefined,
  });

  //const displayVerdict = formVerdict(player.localVerdict);
  const displayAccCreation = formatCreationDate(timeCreated);

  const verdictOptions = makeLocalizedVerdictOptions();

  // Get steam info
  React.useEffect(() => {
    const fetchSteamInfo = async () => {
      const result = await updateSteamInfo([steamID64]);
      if (result.length === 0) {
        // Failed to get steamInfo
        setPlayerInfo(null);
        return;
      }
      setPlayerInfo(result[0]);
    };
    fetchSteamInfo();
  }, []);

  React.useEffect(() => {
    // The user must provide a verdict other than "Player" or some custom information in order for the backend to retain it.
    setMeetRequirements(
      !!(
        parameters.verdict &&
        (parameters.verdict !== 'Player' ||
          parameters.customAlias ||
          parameters.customNote)
      ),
    );
  }, [parameters]);

  // Update pfp on mount
  React.useEffect(() => {
    if (!playerInfo?.steamInfo?.pfp) return;

    verifyImageExists(playerInfo?.steamInfo.pfp, './person.webp').then(
      (src) => {
        setPfp(src);
      },
    );
  }, [playerInfo?.steamInfo?.pfp]);

  return (
    <div
      className="phc-wrapper relative mx-3 my-1 py-4 px-4 mx-full max-h-100 min-w-[770px] bg-secondary shadow-sm rounded-md flex space-x-4 text-ellipsis whitespace-nowrap"
      key={steamID64}
      ref={playerHistoryRef}
    >
      <img
        width={128}
        height={128}
        src={pfp}
        alt="Profile Picture"
        className="block h-32 w-32 rounded-md outline outline-highlight/30 outline-1"
      />
      <div className="min-w-[600px]">
        <div className="flex text-3xl font-bold">
          <a
            href={playerInfo?.steamInfo?.profileUrl}
            target="_blank"
            className="hover:text-sky-300 mr-2"
            rel="noreferrer"
          >
            <div className="relative bottom-0.5">
              {playerInfo?.steamInfo?.name}
            </div>
          </a>
          <div className="pl-3 py-3 text-sm text-gray-400 relative bottom-1">
            {t('ACC_CREATION')}: {displayAccCreation}
          </div>
          {playerInfo?.steamInfo?.profileVisibility?.includes(
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
          {playerInfo?.steamInfo?.profileVisibility?.includes(
            'Friends Only',
          ) && (
            <Tooltip
              content={t('FRIENDS_ONLY')}
              direction="bottom"
              className="bottom-0.5"
            >
              <Users2 color="grey" />
            </Tooltip>
          )}
        </div>
        <div className="flex">
          <Select
            className="sticky pr-1 z-30 w-[175px]"
            options={verdictOptions}
            placeholder={t('SELECT_VERDICT')}
            onChange={(e) => {
              const verdict = e.toString();
              setParameters({
                ...parameters,
                verdict: verdict,
              });
            }}
          />
          <div className="flex flex-grow w-max-content ml-1 p-1 border border-gray-700">
            <Search
              className="min-w-[400px]"
              placeholder={t('SET_CUSTOM_ALIAS')}
              onChange={(alias: string) => {
                setParameters({
                  ...parameters,
                  customAlias: alias,
                });
              }}
            />
          </div>
        </div>
        <div className="flex min-w-[600px] my-1 p-1 border border-gray-700">
          <Search
            className="min-w-[575px]"
            placeholder={t('ADD_CUSTOM_NOTE')}
            onChange={(note: string) => {
              setParameters({
                ...parameters,
                customNote: note,
              });
            }}
          />
        </div>
        <div className="flex min-w-[600px] my-1">
          <button
            className={
              'ml-auto mt-3 mb-0 h-10 w-[100px] rounded-sm items-center bg-red-700'
            }
            disabled={false}
            onClick={() => {
              closeModal();
            }}
          >
            {t('CANCEL')}
          </button>
          <button
            className={`ml-2 mt-3 mb-0 h-10 w-[100px] rounded-sm items-center ${
              meetRequirements ? 'bg-blue-700' : 'bg-gray-400'
            }`}
            disabled={!meetRequirements}
            onClick={() => {
              // '|| undefined' to prevent empty strings being needlessly written to the playerlist
              updatePlayer(steamID64, parameters.verdict || undefined, {
                alias: parameters.customAlias || undefined,
                playerNote: parameters.customNote || undefined,
              });
              closeModal();
            }}
          >
            {t('ADD_PLAYER')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerModal;
