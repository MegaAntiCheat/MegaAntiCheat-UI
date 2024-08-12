import React, { ReactElement } from 'react';
import { Book } from 'lucide-react';
import { SideMenuInner, Tooltip } from '@components/General';
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

  const inner = (
    <SideMenuInner
      icon={icon}
      title={title}
      overrideCollapse={overrideCollapse}
    />
  );

  return (
    <div
      className={` ${selected ? 'bg-highlight/10' : 'hover:bg-highlight/5'} ${collapsed && 'justify-center'} group flex whitespace-nowrap p-3 transition-all hover:cursor-pointer`}
      onClick={onClick}
    >
      {collapsed || overrideCollapse ? (
        <Tooltip content={title} direction="right">
          {inner}
        </Tooltip>
      ) : (
        inner
      )}
    </div>
  );
};

export default SideMenuItem;
