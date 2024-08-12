import React, { FC } from 'react';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuLogoProps {
  overrideCollapse?: boolean;
}

const SideMenuLogo: FC<SideMenuLogoProps> = ({ overrideCollapse }) => {
  const { collapsed } = useSideMenu();

  return (
    <a
      className={'flex items-center gap-3'}
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

      {(overrideCollapse || !collapsed) && (
        <p className={'text-xl font-medium'}>MegaAntiCheat</p>
      )}
    </a>
  );
};

export default SideMenuLogo;
