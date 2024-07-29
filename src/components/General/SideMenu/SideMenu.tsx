import ToSSideMenu from '@components/TF2/ToS/ToSSideMenu';
import React, { Dispatch, SetStateAction } from 'react';
import { Divider, SideMenuItem } from '@components/General';
import MenuHeader from './MenuHeader';

import { t } from '@i18n';
import './SideMenu.css';
import { MENU_ITEMS, PAGES } from '../../../constants/menuConstants';

interface SideMenuProps {
  setCurrentPage: Dispatch<SetStateAction<PAGES>>;
  currentPage: PAGES;
  showTosSuggestions?: boolean;
}

const SideMenu = ({
  setCurrentPage,
  currentPage,
  showTosSuggestions,
}: SideMenuProps) => {
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

  const menuItemsToShow = MENU_ITEMS.map(({ titleKey, icon, page }) => (
    <SideMenuItem
      key={page}
      title={t(titleKey)}
      Icon={icon}
      collapsed={collapsed}
      onClick={() => setCurrentPage(page)}
      selected={currentPage === page}
    />
  ));
  if (showTosSuggestions) {
    menuItemsToShow.unshift(
      <div>
        <ToSSideMenu collapsed={collapsed} />
      </div>,
    );
  }

  return (
    <>
      <div
        className={`side-menu fixed left-0 top-0 h-screen z-50 bg-secondary outline-outline/30 outline-1 outline w-full sm:w-2/4 max-w-sm transition-all ease-in-out ${
          collapsed ? 'collapsed' : ''
        }`}
        ref={MenuRef}
      >
        <MenuHeader
          collapsed={collapsed}
          handleSymbolClick={handleToggleClick}
        />
        <div>
          <Divider size={2} />
          {menuItemsToShow}
        </div>
      </div>
      <div
        className={`w-[100vw] h-[100vh] z-40 ${
          !collapsed ? ' bg-black/10' : ''
        }`}
      />
    </>
  );
};

export default SideMenu;
