import React, { FC } from 'react';
import { t } from '@i18n';
import { Accordion, ColorSelector } from '@components/General';
import { PreferenceListItem } from './PreferenceListItem';
import { Info } from 'lucide-react';

interface ColorPreferencesProps {
  settings: Settings;
  handleDebouncedSettingChange: (
    arg0: string,
    arg1: Record<string, string>,
  ) => void;
}

export const ColorPreferences: FC<ColorPreferencesProps> = ({
  settings,
  handleDebouncedSettingChange,
}) => {
  const newLineHandledText = (value: string) =>
    value.split('\n').map((str, index) => (
      <p className={'text-sm text-highlight'} key={index}>
        {str}
      </p>
    ));

  return (
    <Accordion title={t('PREF_COLORS')} className="preference-accordion">
      <div className="mx-auto mb-2 mt-1 flex w-full flex-col gap-2 border border-outline/30 bg-secondary p-4 md:flex-row md:items-center lg:w-fit">
        <Info size={16} className={'text-highlight'} />
        <span className={'flex flex-col'}>
          {newLineHandledText(t('PREF_COLORS_PRECEDENCE'))}
        </span>
      </div>

      <PreferenceListItem>
        <div className="preference-title">{t('YOU')}</div>
        <ColorSelector
          value={settings.external.colors?.You}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              You: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('CONVICT')}</div>
        <ColorSelector
          value={settings.external.colors?.Convict}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Convict: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('CHEATER')}</div>
        <ColorSelector
          value={settings.external.colors?.Cheater}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Cheater: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('BOT')}</div>
        <ColorSelector
          value={settings.external.colors?.Bot}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Bot: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('SUSPICIOUS')}</div>
        <ColorSelector
          value={settings.external.colors?.Suspicious}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Suspicious: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('TRUSTED')}</div>
        <ColorSelector
          value={settings.external.colors?.Trusted}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Trusted: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('FRIEND')}</div>
        <ColorSelector
          value={settings.external.colors?.Friend}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Friend: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('FRIEND_OF_CHEATER')}</div>
        <ColorSelector
          value={settings.external.colors?.FriendOfCheater}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              FriendOfCheater: e,
            });
          }}
        />
      </PreferenceListItem>

      <PreferenceListItem>
        <div className="preference-title">{t('PLAYER')}</div>
        <ColorSelector
          value={settings.external.colors?.Player}
          onChange={(e) => {
            handleDebouncedSettingChange('colors', {
              Player: e,
            });
          }}
        />
      </PreferenceListItem>
    </Accordion>
  );
};
