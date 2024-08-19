import React, { FC } from 'react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuLogoProps {
  overrideCollapse?: boolean;
}

const SideMenuLogo: FC<SideMenuLogoProps> = ({ overrideCollapse }) => {
  const { collapsed } = useSideMenu();

  return (
    <a
      className={'relative flex w-full items-center gap-3 p-3'}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="flex flex-shrink-0 rounded-lg"
        height={32}
        width={32}
        src="./mac_logo.webp"
        alt="Logo"
      />

      {(overrideCollapse || !collapsed) && (
        <p className={'text-xl font-medium'}>MegaAntiCheat</p>
      )}
    </a>
  );
};

export default SideMenuLogo;
