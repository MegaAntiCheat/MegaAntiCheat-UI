import React from 'react';
import { Flex, Select, TextItem } from '@components/General';
import { t, translations, currentLang, setLanguage } from '@i18n';

const Preferences = () => {
  const [forceUpdate, doForceUpdate] = React.useState(0);
  const options: SelectOption[] = Object.keys(translations).map((language) => ({
    label: language,
    value: language,
  }));

  return (
    <>
      <TextItem className="page-header" fontSize="h1">
        {t('PREFERENCES')}
      </TextItem>
      <div>
        <Flex>
          <div>{t('LANGUAGE')}</div>
          <Select
            placeholder={currentLang}
            options={options}
            onChange={(e) => {
              setLanguage(e.toString());
              doForceUpdate(forceUpdate + 1);
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default Preferences;
