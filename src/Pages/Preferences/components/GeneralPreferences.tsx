import React, { FC } from 'react';
import { currentLang, setLanguage, t } from '@i18n';
import { Accordion, Checkbox, Select } from '@components/General';
import { PreferenceListItem } from './PreferenceListItem';

interface GeneralPreferencesProps {
  languageOptions: SelectOption[];
  handleSettingChange: (
    key: string,
    value: unknown,
    type?: 'internal' | 'external',
  ) => void;
  settings: Settings;
}

export const GeneralPreferences: FC<GeneralPreferencesProps> = ({
  languageOptions,
  handleSettingChange,
  settings,
}) => {
  return (
    <Accordion title={t('PREF_GENERAL')}>
      <PreferenceListItem>
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
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('PREF_OPEN_IN_APP')}</div>
        <Checkbox
          checked={settings?.external.openInApp}
          onChange={(e) => handleSettingChange('openInApp', e)}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('PREF_RAGE_KICK_BOTS')}</div>
        <Checkbox
          checked={settings.internal?.dumbAutokick}
          onChange={(e) => handleSettingChange('dumbAutokick', e, 'internal')}
        />
      </PreferenceListItem>
    </Accordion>
  );
};
