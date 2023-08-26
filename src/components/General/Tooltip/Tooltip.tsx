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
  const newLineHandledText = content
    .split('\n')
    .map((str, index) => <p key={index}>{str}</p>);

  return (
    <div className={`tooltip-container relative inline-block ${className}`}>
      <div className="tooltip-content inline-block align-middle">
        {children}
      </div>
      <div
        className={`tooltip absolute p-1 pl-2 pr-2 bg-neutral-900/[98] pointer-events-none text-white text-base z-50 whitespace-nowrap rounded-md opacity-0  ${direction}`}
      >
        {newLineHandledText}
      </div>
    </div>
  );
};

export default Tooltip;
