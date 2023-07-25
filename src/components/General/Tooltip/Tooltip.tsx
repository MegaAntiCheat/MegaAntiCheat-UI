import React, { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  className?: string;
  children?: ReactNode;
}

const Tooltip = ({ content, className, children }: TooltipProps) => {
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
      {isTooltipVisible && <div className="tooltip">{content}</div>}
    </div>
  );
};

export default Tooltip;
