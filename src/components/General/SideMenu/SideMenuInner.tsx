import React, { FC, ReactElement } from 'react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuInnerProps {
  icon: ReactElement;
  title: string;
}

const SideMenuInner: FC<SideMenuInnerProps> = ({ icon, title }) => {
  const { collapsed } = useSideMenu();

  return (
    <div className="relative flex items-center justify-center gap-3">
      <div className={'flex w-8 justify-center'}>{icon}</div>
      {!collapsed && (
        <div className="absolute left-10 w-[150px]">
          <p className="w-full select-none truncate text-lg">{title}</p>
        </div>
      )}
    </div>
  );
};

export default SideMenuInner;
