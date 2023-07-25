import React, { ChangeEvent } from 'react';
import './TextInput.css';

interface TextInputProps {
  value?: string;
  onChange?: (event: string) => void;
  placeholder?: string;
  type?: string;
}

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}: TextInputProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (typeof onChange === 'function') onChange(inputValue);
  };

  return (
    <div className="text-input-container">
      <input
        type={type}
        className="text-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextInput;
