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
      className={`menu-icon ml-[5%] top-1 relative transition-all-[0.3s bottom ease-in-out] ${
        collapsed ? 'collapsed' : ''
      }`}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="rounded-lg"
        height={32}
        width={32}
        src="./mac_logo.webp"
        alt="Logo"
      />
    </a>
  );

  return (
    <span
      className={`menu-header relative flex min-h-8 h-[88px] flex-col justify-center ${
        collapsed ? 'collapsed' : ''
      }`}
    >
      {collapsed && menuIcon}
      <div className="menu-header-flex flex items-center justify-start">
        {!collapsed && menuIcon}
        {!collapsed && (
          <span
            className={`menu-title mr-[5%] ml-[3%] text-lg flex-grow transition-opacity-[0.5s ease-in-out] opacity-1 overflow-hidden ${
              collapsed ? 'collapsed' : ''
            }`}
          >
            MegaAntiCheat
          </span>
        )}
        <span
          className={`menu-toggle w-8 h-8 absolute top-[50%] -translate-y-2/4 cursor-pointer right-5 ${
            collapsed ? 'collapsed' : ''
          }`}
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
