import React, { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';
import { t } from '@i18n';

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

const Select = ({
  options,
  placeholder = t('COMPONENT_SELECT'),
  onChange,
  className = '',
  disabled = false,
  onMouseEnter,
  onMouseLeave,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = ({ label, value }: SelectOption) => {
    setSelectedOption(label);
    setIsOpen(false);
    if (typeof onChange === 'function') onChange(value);
  };

  const shouldRenderOptionsBelow = () => {
    if (!selectRef.current) return true;
    const { top, height } = selectRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // 75 seems to work
    const spaceBelow = windowHeight - top - height - 75;
    return spaceBelow >= height;
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    } 
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
      className={`relative ${className}  ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`select-head ${isOpen ? 'active' : ''}`}>
        <div className="select-text" aria-hidden="true">
          {selectedOption ? selectedOption : t('COMPONENT_SELECT')}
        </div>
        <ChevronDown
          className={`select-icon transition relative left-1.5 ${
            isOpen ? 'open' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div
          className={`select-options-container ${
            shouldRenderOptionsBelow() ? 'below' : 'above'
          }`}
        >
          <ul className="select-options select-none" role="listbox">
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
