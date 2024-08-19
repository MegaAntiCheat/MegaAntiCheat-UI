import ToSModal from '@components/TF2/ToS/ToSModal';
import { useModal } from '@context';
import React from 'react';
import { t, translations } from '@i18n';
import {
  defaultSettings,
  getAllSettings,
  setSettingKey,
} from '@api/preferences';

import './Preferences.css';
import { debounce } from '@api/utils';
import Loading from '@components/General/Loading/Loading';
import { GeneralPreferences } from './components/GeneralPreferences';
import { ColorPreferences } from './components/ColorPreferences';
import AdvancedPreferences from './components/AdvancedPreferences';

const Preferences = () => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [rconRevealed, setRconRevealed] = React.useState(false);
  const [masterbaseKeyRevealed, setMasterbaseKeyRevealed] =
    React.useState(false);
  const [steamApiKeyRevealed, setSteamApiKeyRevealed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { openModal } = useModal();
  const [refresh, setRefresh] = React.useState(0);

  const languageOptions: SelectOption[] = Object.keys(translations).map(
    (language) => ({
      label: language,
      value: language,
    }),
  );

  const friendsApiUsageOptions: SelectOption[] = [
    {
      label: t('PREF_FRIEND_API_USAGE_ALL'),
      value: 'All',
    },
    {
      label: t('PREF_FRIEND_API_USAGE_CHEATERS_ONLY'),
      value: 'CheatersOnly',
    },
    {
      label: t('PREF_FRIEND_API_USAGE_NONE'),
      value: 'None',
    },
  ];

  console.log(settings.internal?.friendsApiUsage);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getAllSettings();
      setSettings(settings);
      setLoading(false);
    };

    void fetchSettings();
  }, [refresh]);

  const handleSettingChange = (
    key: string,
    value: unknown,
    type: 'internal' | 'external' = 'external',
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [type]: {
        ...prevSettings[type],
        [key]: value,
      },
    }));

    setSettingKey(key, value, type);
  };

  const handleDebouncedSettingChange = React.useCallback(
    debounce(handleSettingChange, 500),
    [],
  );

  if (loading) return <Loading />;

  function handleTermsChange(value: boolean) {
    const closeCallback = () => {
      setTimeout(() => {
        setRefresh(refresh + 1);
      }, 500);
    };
    if (value) {
      openModal(<ToSModal isUnsetting={false} />, {
        closeCallback,
      });
    } else {
      openModal(<ToSModal isUnsetting={true} />, {
        closeCallback,
      });
    }
  }

  function handleMasterbaseKeyChange(e: string) {
    // TODO show TOS if they change the masterbase key and (they haven't agreed to the TOS or the tos agreement is out of date)
    handleSettingChange('masterbaseKey', e, 'internal');
  }

  return (
    <div className="p-4 pt-5">
      <div className="flex flex-col gap-4">
        <GeneralPreferences
          languageOptions={languageOptions}
          handleSettingChange={handleSettingChange}
          settings={settings}
        />
        <ColorPreferences
          settings={settings}
          handleDebouncedSettingChange={handleDebouncedSettingChange}
        />
        <AdvancedPreferences
          steamApiKeyRevealed={steamApiKeyRevealed}
          settings={settings}
          handleSettingChange={handleSettingChange}
          setSteamApiKeyRevealed={setSteamApiKeyRevealed}
          rconRevealed={rconRevealed}
          setRconRevealed={setRconRevealed}
          friendsApiUsageOptions={friendsApiUsageOptions}
          handleTermsChange={handleTermsChange}
          masterbaseKeyRevealed={masterbaseKeyRevealed}
          handleMasterbaseKeyChange={handleMasterbaseKeyChange}
          setMasterbaseKeyRevealed={setMasterbaseKeyRevealed}
        />
      </div>
    </div>
  );
};

export default Preferences;
