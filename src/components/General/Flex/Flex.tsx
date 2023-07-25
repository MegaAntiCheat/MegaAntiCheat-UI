import React, { ReactNode } from 'react';
import './Flex.css';

interface FlexProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: object;
}

const Flex = ({ children, className = '', onClick, style }: FlexProps) => {
  const handleClick = () => {
    if (typeof onClick === 'function') onClick();
  };
  return (
    <div onClick={handleClick} className={`flex ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Flex;
