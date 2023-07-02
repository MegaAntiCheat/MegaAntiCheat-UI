import React from "react";
import "./Divider.css";

interface DividerType {
  size?: Number;
  padding?: Number;
}

const Divider = ({ size = 0, padding = 0 }: DividerType) => {
  return (
    <div
      className="divider"
      style={{ height: `${size}px`, padding: `${padding}px` }}
    />
  );
};

export default Divider;
