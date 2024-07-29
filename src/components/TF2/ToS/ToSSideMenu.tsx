import { t } from '@i18n';
import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SideMenuItem } from '@components/General';

interface ProvisionProps {
  collapsed: boolean;
}

function ToSSideMenu({ collapsed }: ProvisionProps) {
  return (
    <SideMenuItem
      key={68}
      title={t('TOS_HINT')}
      Icon={<AlertTriangle color="yellow" className="bounce" />}
      collapsed={collapsed}
      onClick={() => {
      }}
      selected={false}
    />
  );
}

export default ToSSideMenu;
