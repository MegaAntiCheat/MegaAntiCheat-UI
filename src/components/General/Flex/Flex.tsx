import { ReactElement, ReactNode } from 'react';
import './Flex.css';
import React from 'react';

interface FlexType {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: any;
}

const Flex = ({ children, className = '', onClick, style }: FlexType) => {
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
