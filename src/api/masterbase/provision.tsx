import { t } from '@i18n';
import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { masterbaseProvisionUrl } from '@api/masterbase/masterbase-api';
import { SideMenuItem } from '@components/General';
import './provision.css';

interface ProvisionProps {
  collapsed: boolean;
}

function Provision({ collapsed }: ProvisionProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      const fetchedUrl = await masterbaseProvisionUrl();
      setUrl(fetchedUrl);
    };

    void fetchUrl();
  }, []);
  return (
    <SideMenuItem
      key={69}
      title={t('PROVISION_HINT')}
      Icon={<AlertTriangle color="yellow" className="bounce" />}
      collapsed={collapsed}
      onClick={() => {
        window.open(url, '_self');
      }}
      selected={false}
    />
  );
}

export default Provision;
