import React, { Dispatch, SetStateAction } from 'react';
import { History, Settings2, Users2 } from 'lucide-react';
import { Divider, SideMenuItem } from '@components/General';
import MenuHeader from './MenuHeader';

import { t } from '@i18n';
import './SideMenu.css';
import { escape } from 'querystring';

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

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;

    setCollapsed(true);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapePress);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, []);

  return (
    <div
      className={`side-menu fixed left-0 top-0 h-screen z-50 bg-secondary outline-outline/30 outline-1 outline w-full sm:w-2/4 max-w-sm transition-all ease-in-out ${
        collapsed ? 'collapsed' : ''
      }`}
      ref={MenuRef}
    >
      <MenuHeader collapsed={collapsed} handleSymbolClick={handleToggleClick} />
      <div>
        <Divider size={2} />
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
        <SideMenuItem
          title={t('PREFERENCES')}
          Icon={<Settings2 />}
          collapsed={collapsed}
          onClick={() => setCurrentPage('preferences')}
        />
      </div>
    </div>
  );
};

export default SideMenu;
