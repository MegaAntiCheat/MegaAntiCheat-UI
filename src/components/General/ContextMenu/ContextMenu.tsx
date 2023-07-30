import React from 'react';
import './ContextMenu.css';

import { ContextMenuContext } from './ContextMenuProvider';

const ContextMenuContent = () => {
  const contextMenuRef = React.useRef<HTMLDivElement>(null);
  const { isVisible, position, menuItems, hideMenu } =
    React.useContext(ContextMenuContext);

  if (!isVisible) return null;

  const handleOutsideClick = (event: MouseEvent) => {
    if (!contextMenuRef.current?.contains(event.target as Node)) {
      hideMenu();
    }
  };

  const style: React.CSSProperties = {
    top: position.y,
    left: position.x,
  };

  const onItemClick = (itemAction: () => void) => {
    hideMenu();
    itemAction();
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div style={style} className="ctx-menu" ref={contextMenuRef}>
      {menuItems.map((item, index) => (
        <div
          className="ctx-menu-item"
          key={index}
          onClick={() => onItemClick(item?.onClick)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

const ContextMenu = () => {
  const { isVisible } = React.useContext(ContextMenuContext);

  if (!isVisible) return null;

  return <ContextMenuContent />;
};

export default ContextMenu;
