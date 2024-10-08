import {
  CSSProperties,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import './ContextMenu.css';

import { ContextMenuContext } from '@context';
import { ChevronRight } from 'lucide-react';

const ContextMenuContent = () => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [showMulti, setShowMulti] = useState<number[]>([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const { isVisible, position, menuItems, hideMenu } =
    useContext(ContextMenuContext);

  if (!isVisible) return null;

  const style: CSSProperties = {
    top: position.y,
    left: position.x,
  };

  const onItemClick = (e: MouseEvent, itemAction: () => void) => {
    e.stopPropagation();
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

  const shouldRenderOptionsBelow = () => {
    if (!contextMenuRef.current) return true;
    const { top, height } = contextMenuRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - top - height;
    return spaceBelow >= height;
  };

  let timesVisible = 0;
  useEffect(() => {
    const handleClick = () => {
      if (isVisible) {
        if (timesVisible) {
          hideMenu();
        }
        timesVisible++;
      }
    };
    if (isVisible) {
      document.addEventListener('click', handleClick);
      document.addEventListener('contextmenu', handleClick);
    }
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleClick);
    };
  }, []);
  const [isBelow, setIsBelow] = useState(false);
  const [positionDetermined, setPositionDetermined] = useState(false);

  useEffect(() => {
    if (!positionDetermined) {
      setIsBelow(shouldRenderOptionsBelow());
      setPositionDetermined(true);
    }
  }, [isVisible, forceUpdate]);
  return (
    <div
      style={style}
      className={`ctx-menu ${isBelow ? 'below' : 'above'}`}
      ref={contextMenuRef}
    >
      {menuItems.map((item, index) => (
        <>
          <div
            className="ctx-menu-item"
            key={item.label + index}
            onClick={(e) => {
              if (item?.onClick) onItemClick(e, item?.onClick);
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
                item.multiOptions.map((menuItem, index) => (
                  <div
                    key={menuItem.label + index}
                    className="ctx-menu-item"
                    onClick={(e) => {
                      if (menuItem?.onClick) onItemClick(e, menuItem?.onClick);
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
  const { isVisible } = useContext(ContextMenuContext);

  if (!isVisible) return null;

  return <ContextMenuContent />;
};

export default ContextMenu;
