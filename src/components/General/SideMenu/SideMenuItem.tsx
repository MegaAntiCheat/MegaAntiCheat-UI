import React, { ReactElement } from 'react';
import { Book } from 'lucide-react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuItemProps {
  title: string;
  icon?: ReactElement;
  onClick?: (arg0: never) => void;
  selected?: boolean;
}

const SideMenuItem = ({
  title,
  icon = <Book />,
  onClick,
  selected = false,
}: SideMenuItemProps) => {
  const { collapsed } = useSideMenu();

  return (
    <div
      className={`${selected ? 'bg-highlight/10' : 'hover:bg-highlight/5'} ${collapsed && 'justify-center'} group flex cursor-pointer whitespace-nowrap p-3 transition-all`}
      onClick={onClick}
    >
      <div className="relative flex items-center justify-center gap-3">
        <div className={'flex w-8 justify-center'}>{icon}</div>
        {!collapsed && (
          <div className="absolute left-10 w-[225px]">
            <p className="w-full select-none truncate text-lg">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideMenuItem;
