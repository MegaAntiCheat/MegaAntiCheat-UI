/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode } from 'react';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  multiOptions?: MenuItem[];
}

interface ContextMenuContextProps {
  isVisible: boolean;
  position: { x: number; y: number };
  menuItems: MenuItem[];
  showMenu: (event: React.MouseEvent<HTMLElement>, items: MenuItem[]) => void;
  hideMenu: () => void;
}

export const ContextMenuContext = React.createContext<ContextMenuContextProps>({
  isVisible: false,
  position: { x: 0, y: 0 },
  menuItems: [],
  showMenu: () => {},
  hideMenu: () => {},
});

interface ContextMenuProviderProps {
  children: React.ReactNode;
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);

  const showMenu = (event: React.MouseEvent, items: MenuItem[]) => {
    setIsVisible(true);
    // -45 to center the menu on the cursor
    setPosition({ x: event.clientX - 45, y: event.clientY - 5 });
    setMenuItems(items);
  };

  const hideMenu = () => {
    setIsVisible(false);
    setPosition({ x: 0, y: 0 });
    setMenuItems([]);
  };

  return (
    <ContextMenuContext.Provider
      value={{ isVisible, position, menuItems, showMenu, hideMenu }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};
