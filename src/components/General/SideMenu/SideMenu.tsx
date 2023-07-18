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
  const MenuRef = React.useRef<HTMLDivElement>(null);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (!MenuRef.current?.contains(event.target as Node)) {
      setCollapsed(true);
    }
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleToggleCollapse();
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`side-menu ${collapsed ? 'collapsed' : ''}`} ref={MenuRef}>
      <MenuHeader collapsed={collapsed} handleSymbolClick={handleToggleClick} />
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
