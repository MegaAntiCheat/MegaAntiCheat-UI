import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Select.css';
import { t } from '@i18n';

interface SelectType {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
}

const Select = ({
  options,
  placeholder = t('COMPONENT_SELECT'),
  onChange,
  className,
  disabled = false,
}: SelectType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = ({ label, value }: SelectOption) => {
    setSelectedOption(label);
    setIsOpen(false);
    if (typeof onChange === 'function') onChange(value);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleArrowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleOpen();
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div
      onClick={toggleOpen}
      className={`select-item-container ${className}  ${
        disabled ? 'disabled' : ''
      }`}
      ref={selectRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-disabled={disabled}
    >
      <div className={`select-head ${isOpen ? 'active' : ''}`}>
        <div className="select-text" aria-hidden="true">
          {selectedOption ? selectedOption : t('COMPONENT_SELECT')}
        </div>
        <div className="select-icon" onClick={handleArrowClick}>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {isOpen && (
        <div className="select-options-container">
          <ul className="select-options" role="listbox">
            {options.map((e) => (
              <li
                className={`select-option ${
                  selectedOption === e.label ? 'selected' : ''
                }`}
                key={e.label}
                value={e.value}
                onClick={() => handleOptionClick(e)}
                role="option"
                aria-selected={selectedOption === e.label}
              >
                {e.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
