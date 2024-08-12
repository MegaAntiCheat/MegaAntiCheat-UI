import React, { FC } from 'react';
import { SideMenuItem, SideMenuLogo } from '@components/General';
import { Menu } from 'lucide-react';

interface SideMenuMobileProps {
  handleToggleClick: (e: React.MouseEvent) => void;
}

export const SideMenuMobile: FC<SideMenuMobileProps> = ({
  handleToggleClick,
}) => {
  return (
    <div
      className={
        'flex h-[60px] w-full items-center justify-between bg-secondary p-4 px-2 md:!hidden'
      }
    >
      <SideMenuLogo overrideCollapse={true} />
      <SideMenuItem
        icon={<Menu />}
        onClick={handleToggleClick}
        title={'Close Menu'}
        overrideCollapse={true}
      />
    </div>
  );
};
