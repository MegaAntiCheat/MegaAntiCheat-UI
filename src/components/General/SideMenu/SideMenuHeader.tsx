import React, { Fragment } from 'react';
import { X } from 'lucide-react';
import { SideMenuItem, SideMenuLogo } from '@components/General';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface MenuHeaderProps {
  handleSymbolClick: (e: React.MouseEvent) => void;
}

const SideMenuHeader: React.FC<MenuHeaderProps> = ({ handleSymbolClick }) => {
  const { collapsed } = useSideMenu();

  return (
    <Fragment>
      <div
        className={`${!collapsed && 'justify-between'} flex min-h-[64px] items-center justify-center px-3 py-4`}
      >
        <SideMenuLogo />

        {/*{!collapsed && (*/}
        {/*  <SideMenuItem*/}
        {/*    icon={<X />}*/}
        {/*    onClick={handleSymbolClick}*/}
        {/*    title={'Close Menu'}*/}
        {/*    overrideCollapse={true}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </Fragment>
  );
};

export default SideMenuHeader;
