import React, { ChangeEvent } from 'react';
import './TextInput.css';

interface TextInputProps {
  value?: string;
  onChange?: (event: string) => void;
  onLeave?: (event: string) => void;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  withIcon?: boolean;
}

const TextInput = ({
  value,
  onChange,
  onLeave,
  placeholder,
  defaultValue = '',
  type = 'text',
  withIcon = false,
}: TextInputProps) => {
  const [input, setInput] = React.useState(value || defaultValue);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
    setInput(event.target.value);
  };

  return (
    <div className={'flex w-max'}>
      <input
        onBlur={() => onLeave && onLeave(input)}
        type={type}
        className={`text-input ${withIcon ? 'with-icon' : ''}`}
        placeholder={placeholder}
        value={input}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextInput;
