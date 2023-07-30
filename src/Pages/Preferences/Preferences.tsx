import React from 'react';
import {
  Accordion,
  Checkbox,
  ColorSelector,
  Flex,
  Select,
  TextInput,
  TextItem,
} from '@components/General';
import { currentLang, setLanguage, t, translations } from '@i18n';
import {
  defaultSettings,
  getAllSettings,
  setSettingKey,
} from '@api/preferences';

import './Preferences.css';
import { debounce } from '@api/utils';

const Preferences = () => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [loading, setLoading] = React.useState(true);

  const languageOptions: SelectOption[] = Object.keys(translations).map(
    (language) => ({
      label: language,
      value: language,
    }),
  );

  React.useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getAllSettings();
      setSettings(settings);
      setLoading(false);
    };

    fetchSettings();
  }, []);

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

  if (loading) {
    return (
      <TextItem className="page-header" fontSize="h1">
        Loading...
      </TextItem>
    );
  }

  return (
    <>
      <div className="preference-container">
        <TextItem className="page-header" fontSize="h1">
          {t('PREFERENCES')}
        </TextItem>
        <div className="preferences">
          <Accordion title={t('PREF_GENERAL')} className="preference-accordion">
            <Flex className="preference-option">
              <div className="preference-title">{t('LANGUAGE')}</div>
              <Select
                className="preference-select"
                placeholder={currentLang}
                options={languageOptions}
                onChange={(e) => {
                  setLanguage(e.toString());
                  handleSettingChange('language', e);
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_OPEN_IN_APP')}</div>
              <Checkbox
                checked={settings?.external.openInApp}
                onChange={(e) => handleSettingChange('openInApp', e)}
              />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_COLORS')} className="preference-accordion">
            <Flex className="preference-option">
              <div className="preference-title">{t('YOU')}</div>
              <ColorSelector
                value={settings.external.colors?.You}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    You: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PLAYER')}</div>
              <ColorSelector
                value={settings.external.colors?.Player}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Player: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('TRUSTED')}</div>
              <ColorSelector
                value={settings.external.colors?.Trusted}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Trusted: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('SUSPICIOUS')}</div>
              <ColorSelector
                value={settings.external.colors?.Suspicious}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Suspicious: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('CHEATER')}</div>
              <ColorSelector
                value={settings.external.colors?.Cheater}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Cheater: e,
                  });
                }}
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('BOT')}</div>
              <ColorSelector
                value={settings.external.colors?.Bot}
                onChange={(e) => {
                  handleDebouncedSettingChange('colors', {
                    Bot: e,
                  });
                }}
              />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_ADVANCED')}>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_STEAM_API_KEY')}</div>
              <TextInput
                type="password"
                value={settings?.internal.steamApiKey}
                onChange={(e) =>
                  handleSettingChange('steamApiKey', e, 'internal')
                }
              />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_RCON_PASSWORD')}</div>
              <TextInput
                value={settings?.internal.rconPassword}
                onChange={(e) =>
                  handleSettingChange('rconPassword', e, 'internal')
                }
              />
            </Flex>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Preferences;
