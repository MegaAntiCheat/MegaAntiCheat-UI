import { ReactElement, ReactNode } from "react";
import "./Flex.css";
import React from "react";

interface FlexType {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Flex = ({ children, className = "", onClick }: FlexType) => {
  const handleClick = () => {
    if (typeof onClick === "function") onClick();
  };
  return (
    <div onClick={handleClick} className={`flex ${className}`}>
      {children}
    </div>
  );
};

export default Flex;
