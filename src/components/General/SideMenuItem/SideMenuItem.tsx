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
      <Flex className="sm-item-flex">
        <div className="sm-item-icon">{Icon}</div>
        <div className={`sm-item-title ${collapsed ? 'blocked' : ''}`}>
          {title}
        </div>
      </Flex>
    );
  };

  return (
    <div
      className={`sm-item-outer p-3 transition-colors delay-100 whitespace-nowrap hover:bg-secondary hover:cursor-pointer hover:rounded-sm ${
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
