import React from 'react';
import './TextInput.css';

interface TextInput {
  value?: string;
  onChange?: (event: any) => void;
  placeholder?: string;
}

const TextInput = ({ value, onChange, placeholder }: TextInput) => {
  const handleInputChange = (event: { target: { value: any } }) => {
    const inputValue = event.target.value;
    if (typeof onChange === 'function') onChange(inputValue);
  };

  return (
    <div className="text-input-container">
      <input
        type="text"
        className="text-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextInput;
