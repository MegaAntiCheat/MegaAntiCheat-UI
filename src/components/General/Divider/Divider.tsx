import React from 'react';
import './Divider.css';

interface DividerProps {
  size?: number;
  padding?: number;
  className?: string;
}

const Divider = ({ size = 1, padding = 0, className }: DividerProps) => {
  return (
    <div
      className={`divider ${className}`}
      style={{ height: `${size}px`, padding: `${padding}px` }}
    />
  );
};

export default Divider;
