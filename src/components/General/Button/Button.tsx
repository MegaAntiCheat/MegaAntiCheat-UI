import React from 'react';
import './Button.css';

interface ButtonProps {
  title?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`mac-button ${props.className}`}
      onClick={props.onClick}
      style={props.style}
      disabled={props.disabled}
    >
      {props.children || props.title}
    </button>
  );
};

export default Button;
