import { setSettingKey } from '@api/preferences';
import { Button } from '@components/General';
import { useModal } from '@context';
import { t } from '@i18n';

interface ToSModalProps {
  isUnsetting?: boolean;
}

export default function ToSModal({ isUnsetting = false }: ToSModalProps) {
  const { closeModal } = useModal();
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
    closeModal();
  };
  return (
    <div style={{ maxHeight: '80vh', overflow: 'hidden' }}>
      <h4 className="text-xl font-bold">{t('TERMS_OF_SERVICE')}</h4>
      {!isUnsetting && (
        <div>
          <div>{t('TOS_DISCLAIMER')}</div>
          <div
            style={{
              maxHeight: '70vh',
              overflowY: 'auto',
              maxWidth: '80vw',
              minWidth: '50vw',
            }}
            className="p-2.5"
          >
            <pre className="tos">{t('tos')}</pre>
            <Button onClick={setTosDate}>{t('CONFIRM_AGREE_TOS')}</Button>
            <Button onClick={closeModal} className="ml-5">
              {t('CANCEL')}
            </Button>
          </div>
        </div>
      )}
      {isUnsetting && (
        <div>
          <div className="pb-5">{t('CONFIRM_WITHDRAW_TOS')}</div>
          <Button onClick={setTosDate}>{t('YES')}</Button>
          <Button onClick={closeModal} className="ml-5">
            {t('NO')}
          </Button>
        </div>
      )}
    </div>
  );
}
