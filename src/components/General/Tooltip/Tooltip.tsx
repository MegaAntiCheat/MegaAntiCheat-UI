import React, { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  className?: string;
  children?: ReactNode;
  direction?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right';
  noWrap?: boolean;
  isButton?: boolean;
}

const Tooltip = ({
  content,
  className = '',
  children,
  direction = 'top',
  noWrap = false,
  isButton = false,
}: TooltipProps) => {
  const newLineHandledText = content
    .split('\n')
    .map((str, index) => <p key={index}>{str}</p>);

  return (
    <div
      className={`${className} ${isButton && 'contents'} tooltip-container relative inline-block`}
    >
      <div
        className={`${isButton && 'contents'} tooltip-content inline-block align-middle`}
      >
        {children}
      </div>
      <div
        className={`${direction} tooltip pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-md bg-neutral-900/[98] p-1 pl-2 pr-2 text-base text-white opacity-0 group-hover:inline-block`}
      >
        {noWrap ? content : newLineHandledText}
      </div>
    </div>
  );
};

export default Tooltip;
