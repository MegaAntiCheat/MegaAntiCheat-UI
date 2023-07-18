import React, { Dispatch, SetStateAction } from 'react';
import { History, Settings2, Users2 } from 'lucide-react';
import { Divider, SideMenuItem } from '@components/General';
import MenuHeader from './MenuHeader';

import './SideMenu.css';
import { t } from '@i18n';

interface SideMenuProps {
  setCurrentPage: Dispatch<SetStateAction<string>>;
}

const SideMenu = ({ setCurrentPage }: SideMenuProps) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`side-menu ${collapsed ? 'collapsed' : ''}`}>
      <MenuHeader
        collapsed={collapsed}
        handleToggleCollapse={handleToggleCollapse}
      />
      <div className="side-menu-content">
        <Divider size={2} />
        <SideMenuItem
          title={t('PREFERENCES')}
          Icon={<Settings2 />}
          collapsed={collapsed}
          onClick={() => setCurrentPage('preferences')}
        />
        <SideMenuItem
          title={t('PLAYERLIST')}
          Icon={<Users2 />}
          collapsed={collapsed}
          onClick={() => setCurrentPage('playerlist')}
        />
        <SideMenuItem
          title={t('PLAYERHISTORY')}
          Icon={<History />}
          collapsed={collapsed}
          onClick={() => setCurrentPage('playerhistory')}
        />
      </div>
    </div>
  );
};

export default SideMenu;
