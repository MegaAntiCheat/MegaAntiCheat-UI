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
  const [isChecked, setIntChecked] = React.useState(checked);

  React.useEffect(() => {
  }, [isChecked])

  const handleClick = () => {
    if (onChange) onChange(!isChecked);

    if (!disabled) setIntChecked(!isChecked);
  };

  return (
    <label className={`checkbox-wrapper ${className}`} onClick={handleClick}>
      <span className={`checkbox-icon ${isChecked ? 'checked' : ''}`}>
        {isChecked ? (
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
