import React from 'react';
import './ContextMenu.css';

import { ContextMenuContext } from '@context/ContextMenuProvider';
import { ChevronRight } from 'lucide-react';

const ContextMenuContent = () => {
  const contextMenuRef = React.useRef<HTMLDivElement>(null);
  const [showMulti, setShowMulti] = React.useState<number[]>([]);
  const [forceUpdate, setForceUpdate] = React.useState(false);
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

  const onMouseEnter = (itemIndex: number) => {
    setShowMulti((current) => [...current, itemIndex]);
    setForceUpdate(!forceUpdate);
  };

  const onMouseLeave = (itemIndex: number) => {
    setShowMulti((current) => current.filter((items) => items !== itemIndex));
    setForceUpdate(!forceUpdate);
  };

  const shouldShowMultiRight = () => {
    if (!contextMenuRef.current) return true;
    const { width, left } = contextMenuRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const spaceBelow = windowWidth - left - width;
    return spaceBelow <= width;
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
        <>
          <div
            className="ctx-menu-item"
            key={index}
            onClick={() => {
              if (item?.onClick) onItemClick(item?.onClick);
            }}
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={() => onMouseLeave(index)}
          >
            <div className="ctxitem-grid">
              {item.label}{' '}
              {item.multiOptions?.length && (
                <ChevronRight
                  className="relative top-1"
                  width={18}
                  height={18}
                />
              )}
            </div>
            <div
              className={`absolute ctx-menu ${
                shouldShowMultiRight() ? 'right' : 'left'
              }`}
            >
              {item.multiOptions &&
                showMulti.includes(index) &&
                item.multiOptions.map((menuItem) => (
                  <div
                    key={menuItem.label}
                    className="ctx-menu-item"
                    onClick={() => {
                      if (menuItem?.onClick) onItemClick(menuItem?.onClick);
                    }}
                  >
                    {menuItem.label}
                  </div>
                ))}
            </div>
          </div>
        </>
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
