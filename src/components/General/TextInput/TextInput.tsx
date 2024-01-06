import React, { ChangeEvent } from 'react';
import './TextInput.css';

interface TextInputProps {
  value?: string;
  onChange?: (event: string) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
}

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  withIcon = false,
}: TextInputProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (typeof onChange === 'function') onChange(inputValue);
  };

  return (
    <div className="text-input-container">
      <input
        type={type}
        className={`text-input ${withIcon ? 'with-icon' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextInput;
