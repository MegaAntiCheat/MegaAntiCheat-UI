import React, { Dispatch, FC, SetStateAction } from 'react';
import { t } from '@i18n';
import { Accordion, Checkbox, Select, TextInput } from '@components/General';
import { PreferenceListItem } from './PreferenceListItem';
import { TextInputPassword } from '@components/General/TextInput/TextInputPassword';

interface AdvancedPreferencesProps {
  steamApiKeyRevealed: boolean;
  settings: Settings;
  handleSettingChange: (
    key: string,
    value: unknown,
    type?: 'internal' | 'external',
  ) => void;
  setSteamApiKeyRevealed: Dispatch<SetStateAction<boolean>>;
  rconRevealed: boolean;
  setRconRevealed: Dispatch<SetStateAction<boolean>>;
  friendsApiUsageOptions: SelectOption[];
  handleTermsChange: (value: boolean) => void;
  masterbaseKeyRevealed: boolean;
  handleMasterbaseKeyChange: (e: string) => void;
  setMasterbaseKeyRevealed: Dispatch<SetStateAction<boolean>>;
}

const AdvancedPreferences: FC<AdvancedPreferencesProps> = ({
  steamApiKeyRevealed,
  settings,
  handleSettingChange,
  setSteamApiKeyRevealed,
  rconRevealed,
  setRconRevealed,
  friendsApiUsageOptions,
  handleTermsChange,
  masterbaseKeyRevealed,
  handleMasterbaseKeyChange,
  setMasterbaseKeyRevealed,
}) => {
  return (
    <Accordion title={t('PREF_ADVANCED')}>
      <span className={'flex flex-col gap-4'}>
        <PreferenceListItem>
          <div className="preference-title">{t('PREF_STEAM_API_KEY')}</div>
          <TextInputPassword
            showEye={steamApiKeyRevealed}
            onClick={() => setSteamApiKeyRevealed(!steamApiKeyRevealed)}
            input={
              <TextInput
                type={steamApiKeyRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.steamApiKey}
                onLeave={(e) =>
                  handleSettingChange('steamApiKey', e, 'internal')
                }
                withIcon
              />
            }
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('PREF_RCON_PASSWORD')}</div>

          <TextInputPassword
            showEye={rconRevealed}
            onClick={() => setRconRevealed(!rconRevealed)}
            input={
              <TextInput
                type={rconRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.rconPassword}
                onLeave={(e) =>
                  handleSettingChange('rconPassword', e, 'internal')
                }
                withIcon
              />
            }
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('PREF_RCON_PORT')}</div>
          <TextInput
            type={'input'}
            defaultValue={settings?.internal.rconPort}
            onLeave={(e) => {
              try {
                const port = Number.parseInt(e);
                handleSettingChange('rconPort', port, 'internal');
                //eslint-disable-next-line no-empty
              } catch {}
            }}
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('PREF_FRIEND_API_USAGE')}</div>
          <Select
            className="preference-select"
            placeholder={
              friendsApiUsageOptions.find((o) => {
                return o.value === settings.internal?.friendsApiUsage;
              })?.label ?? 'Select'
            }
            options={friendsApiUsageOptions}
            onChange={(e) => {
              handleSettingChange('friendsApiUsage', e, 'internal');
            }}
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('AGREE_TO_TOS')}</div>
          <Checkbox
            checked={!!settings?.internal.tosAgreementDate}
            onChange={(e) => handleTermsChange(e)}
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('PREF_MASTERBASE_KEY')}</div>
          <TextInputPassword
            input={
              <TextInput
                type={masterbaseKeyRevealed ? 'input' : 'password'}
                defaultValue={settings?.internal.masterbaseKey}
                onLeave={(e) => handleMasterbaseKeyChange(e)}
                withIcon
              />
            }
            onClick={() => setMasterbaseKeyRevealed(!masterbaseKeyRevealed)}
            showEye={masterbaseKeyRevealed}
          />
        </PreferenceListItem>

        <PreferenceListItem>
          <div className="preference-title">{t('PREF_MASTERBASE_HOST')}</div>
          <TextInput
            type={'input'}
            defaultValue={settings?.internal.masterbaseHost}
            onLeave={(e) =>
              handleSettingChange('masterbaseHost', e, 'internal')
            }
          />
        </PreferenceListItem>
      </span>
    </Accordion>
  );
};

export default AdvancedPreferences;
