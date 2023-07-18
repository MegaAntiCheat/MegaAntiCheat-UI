import React from 'react';
import { Menu, X } from 'lucide-react';

interface MenuHeaderProps {
  collapsed: boolean;
  handleSymbolClick: (e: React.MouseEvent) => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  collapsed,
  handleSymbolClick,
}) => {
  const menuIcon = (
    <a
      className={`menu-icon ${collapsed ? 'collapsed' : ''}`}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        width={32}
        height={32}
        style={{ borderRadius: '10px' }}
        src="./mac_logo.webp"
        alt="Logo"
      />
    </a>
  );

  return (
    <span className="menu-header">
      {collapsed && menuIcon}
      <div className="menu-header-flex">
        {!collapsed && menuIcon}
        {!collapsed && (
          <span className={`menu-title ${collapsed ? 'collapsed' : ''}`}>
            MegaAntiCheat
          </span>
        )}
        <span
          className={`menu-toggle ${collapsed ? 'collapsed' : ''}`}
          onClick={handleSymbolClick}
        >
          {collapsed ? (
            <Menu width={32} height={32} />
          ) : (
            <X width={32} height={32} />
          )}
        </span>
      </div>
    </span>
  );
};

export default MenuHeader;
