import React from 'react';
import { useSideMenu } from '../../../Context/SideMenuContext';

export default function SideMenuLogo() {
  const { collapsed } = useSideMenu();

  return (
    <a
      className={`${collapsed ? 'border-secondary' : 'border-outline/30'} flex w-full items-center gap-3 border-b p-3`}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={'size-8 overflow-clip rounded-sm object-cover'}>
        <img src="./mac_logo.webp" alt="Logo" />
      </div>

      {!collapsed && <p className="text-xl font-medium">MegaAntiCheat</p>}
    </a>
  );
}
