import React from 'react';
import {
  Accordion,
  ColorSelector,
  Flex,
  Select,
  TextInput,
  TextItem,
} from '@components/General';
import { t, translations, currentLang, setLanguage } from '@i18n';

import './Preferences.css';

const Preferences = () => {
  const [forceUpdate, doForceUpdate] = React.useState(0);
  const options: SelectOption[] = Object.keys(translations).map((language) => ({
    label: language,
    value: language,
  }));

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
                options={options}
                onChange={(e) => {
                  setLanguage(e.toString());
                  doForceUpdate(forceUpdate + 1);
                }}
              />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_COLORS')} className="preference-accordion">
            <Flex className="preference-option">
              <div className="preference-title">{t('PLAYER')}</div>
              <ColorSelector />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('CHEATER')}</div>
              <ColorSelector />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('SUSPICIOUS')}</div>
              <ColorSelector />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('TRUSTED')}</div>
              <ColorSelector />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('BOT')}</div>
              <ColorSelector />
            </Flex>
          </Accordion>
          <Accordion title={t('PREF_ADVANCED')}>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_STEAM_API_KEY')}</div>
              <TextInput type="password" />
            </Flex>
            <Flex className="preference-option">
              <div className="preference-title">{t('PREF_RCON_PASSWORD')}</div>
              <TextInput type="password" />
            </Flex>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default Preferences;
