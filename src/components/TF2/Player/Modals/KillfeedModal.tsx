import React from 'react';
import { KILLFEED_ENDPOINT, useFakedata } from '@api/globals';
import { getWeaponImage } from '../killfeedutils';
import './KillfeedModal.css';
import { formatTimeToString } from '../playerutils';
import { X } from 'lucide-react';
import { useModal } from '@context';
import { Select } from '@components/General';

type KillfeedMode = 'Kills' | 'Deaths' | 'Everything';

interface PlayerKillfeedModalProps {
  team: number;
  steamID64: string;
  startingMode?: KillfeedMode;
  setKillfeedMode: (mode: KillfeedMode) => void;
}

interface KillfeedEntry {
  killer_name: string;
  killer_steamid?: string;
  victim_name: string;
  victim_steamid?: string;
  weapon: string;
  crit: boolean;
  timestamp: string;
  elapsed?: number; // seconds, not sent by server
}

const PlayerKillfeedModal = ({
  team,
  steamID64,
  startingMode,
  setKillfeedMode,
}: PlayerKillfeedModalProps) => {
  const [loadingFailed, setLoadingFailed] = React.useState(false);
  const [killfeed, setKillfeed] = React.useState<null | KillfeedEntry[]>(null);
  const [playerKills, setPlayerKills] = React.useState<null | KillfeedEntry[]>(
    null,
  );
  const [mode, setMode] = React.useState<KillfeedMode>(
    startingMode ?? 'Everything',
  );

  const { closeModal } = useModal();

  const playerColor = team === 2 ? '#f35151' : '#529cf2';
  const enemyColor = team === 2 ? '#529cf2' : '#f35151';

  React.useEffect(() => {
    if (useFakedata) {
      setKillfeed([
        {
          killer_name: 'killer of killers',
          victim_name: 'killer',
          victim_steamid: steamID64,
          weapon: 'sniperrifle',
          crit: true,
          timestamp: new Date(Date.now() - 6e5).toISOString(),
        },
        {
          killer_name: 'killer',
          killer_steamid: steamID64,
          victim_name: 'victim',
          weapon: 'knife',
          crit: false,
          timestamp: new Date(Date.now() - 5e5).toISOString(),
        },
      ]);
      return;
    }

    const updateKillfeed = () => {
      fetch(KILLFEED_ENDPOINT)
        .then(async (res) => {
          const json = await res.json();
          setKillfeed(json);
          setLoadingFailed(false);
        })
        .catch(() => setLoadingFailed(true));
    };

    const interval = setInterval(updateKillfeed, 3000);
    updateKillfeed();

    return () => clearInterval(interval);
  }, []);

  // filter to relevant kills
  React.useEffect(() => {
    if (killfeed === null) return;

    const playerKills = killfeed
      .filter(
        (entry) =>
          (mode !== 'Deaths' && entry.killer_steamid === steamID64) ||
          (mode !== 'Kills' && entry.victim_steamid === steamID64),
      )
      .reverse();

    for (const kill of playerKills) {
      const elapsed = Math.floor(
        (Date.now() - Date.parse(kill.timestamp)) / 1000,
      );
      kill.elapsed = elapsed;
    }

    setPlayerKills(playerKills);
  }, [killfeed, mode]);

  // periodically update elapsed time
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlayerKills((prev) => {
        if (prev === null) return null;
        // recalculate elapsed
        // as much as I'd like to just elapsed++ react calls this function twice to
        // make sure there aren't any impurities
        for (const kill of prev) {
          const elapsed = Math.floor(
            (Date.now() - Date.parse(kill.timestamp)) / 1000,
          );
          kill.elapsed = elapsed;
        }
        return [...prev];
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center flex-row-reverse border-b pb-1 border-b-highlight/30 mb-2">
        <button onClick={closeModal}>
          <X />
        </button>
      </div>
      {loadingFailed ? (
        <div className="text-3xl whitespace-nowrap px-6">
          Error loading killfeed
        </div>
      ) : playerKills === null ? (
        <div className="text-3xl whitespace-nowrap px-6">loading...</div>
      ) : playerKills.length === 0 ? (
        <div className="text-3xl whitespace-nowrap px-6 text-center">
          No{' '}
          {mode === 'Everything'
            ? 'kills/deaths'
            : mode === 'Kills'
            ? 'kills'
            : 'deaths'}
          !
        </div>
      ) : (
        <div className="grid grid-cols-killfeed gap-3 max-h-[75vh] overflow-y-auto pr-2">
          {playerKills.map((entry, index) => {
            return (
              <>
                <div className="flex items-center justify-center whitespace-nowrap">
                  {entry.elapsed !== undefined &&
                    `${formatTimeToString(entry.elapsed)} ago`}
                </div>
                <div key={index} className="flex">
                  <div
                    className={`flex items-center rounded-md pl-5 pr-5 font-bold h-8 km-kill ${
                      entry.crit ? 'crit' : ''
                    }`}
                    title={`${entry.killer_name} killed ${
                      entry.victim_name
                    } with ${entry.weapon}.${entry.crit ? ' (crit)' : ''}`}
                  >
                    <div
                      className="whitespace-nowrap"
                      style={{
                        color:
                          entry.killer_steamid === steamID64
                            ? playerColor
                            : enemyColor,
                      }}
                    >
                      {entry.killer_name}
                    </div>
                    <img
                      className="pl-4 pr-4"
                      src={getWeaponImage(entry.weapon, entry.crit)}
                    />
                    <div
                      className="whitespace-nowrap"
                      style={{
                        color:
                          entry.killer_steamid === steamID64
                            ? enemyColor
                            : playerColor,
                      }}
                    >
                      {entry.victim_name}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
      {!loadingFailed && playerKills ? (
        <div className="flex items-center justify-end gap-3 pt-2">
          Include:
          <Select
            className="min-w-[125px]"
            placeholder={mode}
            onChange={(e) => {
              setMode(e as KillfeedMode);
              setKillfeedMode(e as KillfeedMode);
            }}
            options={[
              {
                label: 'Kills',
                value: 'Kills',
              },
              {
                label: 'Deaths',
                value: 'Deaths',
              },
              {
                label: 'Everything',
                value: 'Everything',
              },
            ]}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PlayerKillfeedModal;
