import React, { FC, ReactElement } from 'react';
import { Flex } from '@components/General';
import { useSideMenu } from '../../../Context/SideMenuContext';

interface SideMenuInnerProps {
  icon: ReactElement;
  title: string;
  overrideCollapse?: boolean;
}

const SideMenuInner: FC<SideMenuInnerProps> = ({
  icon,
  title,
  overrideCollapse,
}) => {
  const { collapsed } = useSideMenu();

  return (
    <Flex className="relative w-full items-center gap-3">
      <div className="relative">{icon}</div>
      {!collapsed && !overrideCollapse && (
        <p className="w-max select-none overflow-hidden truncate text-lg">
          {title}
        </p>
      )}
    </Flex>
  );
};

export default SideMenuInner;
