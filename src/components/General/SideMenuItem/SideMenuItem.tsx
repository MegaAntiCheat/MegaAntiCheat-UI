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
      className={`sm-item-outer ${collapsed ? 'collapsed' : ''}`}
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
