import React, { FC } from 'react';
import { SideMenuItem, SideMenuLogo } from '@components/General';
import { Menu, X } from 'lucide-react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuMobileProps {
  handleToggleClick: (e: React.MouseEvent) => void;
}

export const SideMenuMobile: FC<SideMenuMobileProps> = ({
  handleToggleClick,
}) => {
  const { collapsed } = useSideMenu();

  return (
    <div
      className={
        'flex h-[60px] w-full items-center justify-between bg-secondary p-4 px-2 md:!hidden'
      }
    >
      <SideMenuLogo overrideCollapse={true} />
      <SideMenuItem
        icon={collapsed ? <Menu /> : <X />}
        onClick={handleToggleClick}
        title={'Close Menu'}
        overrideCollapse={true}
      />
    </div>
  );
};
