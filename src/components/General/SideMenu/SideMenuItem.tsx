import React, { ReactElement } from 'react';
import { Book } from 'lucide-react';
import { SideMenuInner } from '@components/General';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuItemProps {
  title: string;
  icon?: ReactElement;
  onClick?: (arg0: never) => void;
  selected?: boolean;
  overrideCollapse?: boolean;
}

const SideMenuItem = ({
  title,
  icon = <Book />,
  onClick,
  selected = false,
  overrideCollapse,
}: SideMenuItemProps) => {
  const { collapsed } = useSideMenu();

  return (
    <div
      className={`${selected ? 'bg-highlight/10' : 'hover:bg-highlight/5'} ${collapsed && 'justify-center'} group flex cursor-pointer whitespace-nowrap p-3 transition-all`}
      onClick={onClick}
    >
      <SideMenuInner
        icon={icon}
        title={title}
        overrideCollapse={overrideCollapse}
      />
    </div>
  );
};

export default SideMenuItem;
