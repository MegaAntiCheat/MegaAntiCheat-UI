import React, { Dispatch, SetStateAction } from 'react';
import { History, Menu, Settings2, Users2, X } from 'lucide-react';
import { Divider, SideMenuItem } from '@components/General';

import './SideMenu.css';
import { t } from '@i18n';

interface SideMenu {
  setCurrentPage: Dispatch<SetStateAction<string>>;
}

const SideMenu = ({ setCurrentPage }: SideMenu) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuIcon = (
    <a
      className={`sidemenu-icon ${collapsed ? 'collapsed' : ''}`}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
    >
      <img
        width={32}
        height={32}
        style={{ borderRadius: '10px' }}
        src="./mac_logo.webp"
      />
    </a>
  );

  const MenuHeader = () => {
    return (
      <span className="sidemenu-header">
        {collapsed && menuIcon}
        <div className="sidemenu-header-flex">
          {!collapsed && menuIcon}
          {!collapsed && (
            <span className={`sidemenu-title ${collapsed ? 'collapsed' : ''}`}>
              MegaAntiCheat
            </span>
          )}
          <span
            className={`sidemenu-toggle ${collapsed ? 'collapsed' : ''}`}
            onClick={handleToggleCollapse}
          >
            {collapsed ? (
              <Menu width={32} height={32} />
            ) : (
              <X width={32} height={32} />
            )}
          </span>
        </div>
      </span>
    );
  };

  return (
    <div className={`sidemenu-outer ${collapsed ? 'collapsed' : ''}`}>
      <MenuHeader />
      <div>
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
