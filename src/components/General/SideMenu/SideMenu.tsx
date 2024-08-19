import React, { Dispatch, SetStateAction } from 'react';
import { SideMenuItem, SideMenuLogo } from '@components/General';

import { t } from '@i18n';
import { MENU_ITEMS, PAGES } from '../../../constants/menuConstants';
import ToSSideMenu from '@components/TF2/ToS/ToSSideMenu';
import { useSideMenu } from '../../../Context/SideMenuContext';
import { SideMenuMobile } from '@components/General/SideMenu/SideMenuMobile';

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
  const { collapsed, setCollapsed, toggleCollapsed, menuRef } = useSideMenu();

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleToggleCollapse();
  };

  return (
    <div className={'z-50 outline outline-1 outline-outline/30'}>
      <SideMenuMobile handleToggleClick={handleToggleClick} />

      {/**
       * TODO:
       * 1) there is still much to do here, not totally happy with the centering
       * of elements. Still rather hacky and not 100% centered.
       * 2) cannot animate between display types -> find solution.
       * */}
      <div
        className={`${collapsed ? 'hidden md:inline-block' : 'absolute w-full outline outline-1 outline-outline/30 md:w-[300px]'} h-full bg-secondary transition duration-300 ease-out`}
        ref={menuRef}
      >
        <span className="hidden md:inline">
          <SideMenuLogo />
        </span>

        {MENU_ITEMS.map(({ titleKey, icon, page }) => (
          <SideMenuItem
            key={page}
            title={t(titleKey)}
            icon={icon}
            onClick={() => {
              setCurrentPage(page);
              toggleCollapsed();
            }}
            selected={currentPage === page}
          />
        ))}

        {showTosSuggestions && (
          <ToSSideMenu collapsed={collapsed} setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
};

export default SideMenu;
