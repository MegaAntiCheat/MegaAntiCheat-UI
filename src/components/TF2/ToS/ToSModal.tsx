import { setSettingKey, setSettings } from '@api/preferences';
import { Button } from '@components/General';
import { t } from '@i18n';

interface ToSModalProps {
  isUnsetting?: boolean;
}

export default function ToSModal({ isUnsetting = false }: ToSModalProps) {
  const TOS1 = t('tos');
  const TOSDisclaimer =
    'Due to our limited resources, the Terms of Service are not available in other languages. We recommend using a translation program or service.';
  const handleSettingChange = (
    key: string,
    value: unknown,
    type: 'internal' | 'external' = 'external',
  ) => {
    void setSettingKey(key, value, type);
  };
  const setTosDate = async () => {
    if (isUnsetting) {
      handleSettingChange('tosAgreementDate', '', 'internal');
    } else {
      handleSettingChange(
        'tosAgreementDate',
        new Date().toISOString(),
        'internal',
      );
    }
  };
  return (
    <div style={{ maxHeight: '80vh', overflow: 'hidden' }}>
      Terms of Service <div>{isUnsetting?.toString()}</div>
      {!isUnsetting && (
        <div>
          <div>{TOSDisclaimer}</div>
          <div
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
            className="p-2.5 mb-5 pb-5"
          >
            <div>{TOS1}</div>
            <Button onClick={setTosDate} className="pb-5">
              I agree to the terms of service
            </Button>
          </div>
        </div>
      )}
      {isUnsetting && (
        <div>
          Withdrawing consent will disable demo-streaming features, meaning you
          can't contribute evidence against the cheaters you come across Are you
          sure you want to withdraw consent?
        </div>
      )}
    </div>
  );
}
