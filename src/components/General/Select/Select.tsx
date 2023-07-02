import React, { MouseEventHandler, useRef, useState } from "react";
import "./Select.css";
import Flex from "../Flex/Flex";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SelectType {
  options: { name: string; value: any }[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

const Select = ({
  options,
  placeholder = "Select",
  onSelect,
  className,
}: SelectType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = ({ name, value }: { name: string; value: any }) => {
    setSelectedOption(name);
    setIsOpen(false);
    if (typeof onSelect === "function") onSelect(value);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`select-item-container ${className}`}
      ref={selectRef}
    >
      <div className={`select-head ${isOpen ? "active" : ""}`}>
        <div className="select-text">
          {selectedOption ? selectedOption : "Select"}
        </div>
        <div className="select-icon">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isOpen && (
        <span className="select-options">
          {options.map((e) => (
            <li
              className={`select-option ${
                selectedOption === e.name ? "selected" : ""
              }`}
              key={e.name}
              value={e.value}
              onClick={() => handleOptionClick(e)}
            >
              {e.name}
            </li>
          ))}
        </span>
      )}
    </div>
  );
};

export default Select;
