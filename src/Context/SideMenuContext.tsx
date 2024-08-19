import React, {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SideMenuContextType {
  menuRef: MutableRefObject<HTMLDivElement | null>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(
  undefined,
);

interface SideMenuProviderProps {
  children: ReactNode;
}

export const SideMenuProvider: React.FC<SideMenuProviderProps> = ({
  children,
}) => {
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const toggleCollapsed = () => {
    setCollapsed((prevState) => !prevState);
  };

  useEffect(() => {
    const menuElement = menuRef.current;

    const handleMouseEnter = () => setCollapsed(false);

    const handleMouseLeave = (event: { clientX: number; clientY: number }) => {
      if (event.clientX > 50) {
        setCollapsed(true);
      }
    };

    if (menuElement) {
      menuElement.addEventListener('mouseenter', handleMouseEnter);
      menuElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener('mouseenter', handleMouseEnter);
        menuElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [menuRef]);

  const value: SideMenuContextType = {
    menuRef,
    collapsed,
    setCollapsed,
    toggleCollapsed,
  };

  return (
    <SideMenuContext.Provider value={value}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = (): SideMenuContextType => {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error('useSideMenu must be used within a SideMenuProvider');
  }
  return context;
};
