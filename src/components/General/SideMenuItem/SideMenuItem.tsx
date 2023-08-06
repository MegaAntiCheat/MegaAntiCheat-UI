import React, { ReactElement } from 'react';
import { Book } from 'lucide-react';
import { Flex, Tooltip } from '@components/General';
import './SideMenuItem.css';

interface SideMenuItemProps {
  title: string;
  Icon?: ReactElement;
  onClick?: () => void;
  collapsed?: boolean;
}

const SideMenuItem = ({
  title,
  Icon = <Book />,
  onClick,
  collapsed = false,
}: SideMenuItemProps) => {
  const SideMenuInner = () => {
    return (
      <Flex className="sm-item-flex items-center relative">
        <div className="sm-item-icon relative ml-[3%]">{Icon}</div>
        <div
          className={`sm-item-title overflow-hidden text-lg ml-[5%] ${
            collapsed ? 'blocked' : ''
          }`}
        >
          {title}
        </div>
      </Flex>
    );
  };

  return (
    <div
      className={`sm-item-outer max-h-[52px] p-3 transition-all whitespace-nowrap hover:bg-highlight/5 hover:bg hover:cursor-pointer ${
        collapsed ? 'collapsed' : ''
      }`}
      onClick={onClick}
    >
      {collapsed ? (
        <Tooltip content={title} direction="right">
          <SideMenuInner />
        </Tooltip>
      ) : (
        <SideMenuInner />
      )}
    </div>
  );
};

export default SideMenuItem as typeof SideMenuItem;
