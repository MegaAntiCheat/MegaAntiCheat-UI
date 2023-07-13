import React, { ReactElement } from 'react';
import { Book } from 'lucide-react';
import { Flex } from '@components/General';
import './SideMenuItem.css';

interface SideMenuItemTypes {
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
}: SideMenuItemTypes) => {
  return (
    <div
      className={`sm-item-outer ${collapsed ? 'collapsed' : ''}`}
      onClick={onClick}
    >
      <Flex className="sm-item-flex">
        <div className="sm-item-icon">{Icon}</div>
        <div className={`sm-item-title ${collapsed ? 'blocked' : ''}`}>
          {title}
        </div>
      </Flex>
    </div>
  );
};

export default SideMenuItem as typeof SideMenuItem;
