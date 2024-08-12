import React, { FC, ReactElement } from 'react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuInnerProps {
  icon: ReactElement;
  title: string;
  overrideCollapse?: boolean;
}

const SideMenuInner: FC<SideMenuInnerProps> = ({
  icon,
  title,
  overrideCollapse,
}) => {
  const { collapsed } = useSideMenu();

  return (
    <div className="relative flex w-full items-center gap-3">
      <div className="relative pl-1">{icon}</div>
      <div
        className={`flex ${overrideCollapse && '!w-0'} ${collapsed ? 'w-0' : 'w-5/6'}`}
      >
        <p className="w-full select-none truncate text-lg">{title}</p>
      </div>
    </div>
  );
};

export default SideMenuInner;
