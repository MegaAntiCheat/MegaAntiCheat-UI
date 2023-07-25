import React, { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  className?: string;
  children?: ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({
  content,
  className = '',
  children,
  direction = 'top',
}: TooltipProps) => {
  const [isTooltipVisible, setTooltipVisible] = React.useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      className={`tooltip-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isTooltipVisible && (
        <div className={`tooltip ${direction}`}>{content}</div>
      )}
    </div>
  );
};

export default Tooltip;
