import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

import './Checkbox.css';

interface CheckboxProps {
  onChange?: (e: boolean) => void;
  title?: string;
  className?: string;
  disabled?: boolean;
  checked?: boolean;
}

const Checkbox = ({
  title,
  className = '',
  disabled = false,
  onChange,
  checked,
}: CheckboxProps) => {
  const [, setIntChecked] = React.useState(checked);

  const handleClick = () => {
    if (onChange) onChange(!checked);

    if (!disabled) setIntChecked(!checked);
  };

  return (
    <label className={`checkbox-wrapper ${className}`} onClick={handleClick}>
      <span className={`checkbox-icon ${checked ? 'checked' : ''}`}>
        {checked ? (
          <CheckSquare width={26} height={26} />
        ) : (
          <Square width={26} height={26} />
        )}
      </span>
      <span className="checkbox-title">{title}</span>
    </label>
  );
};

export default Checkbox;
