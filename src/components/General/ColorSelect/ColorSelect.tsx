import React from 'react';
import { Pencil, Trash, X } from 'lucide-react';
import { Flex } from '@components/General';
import { HexColorPicker } from 'react-colorful';
import './ColorSelect.css';

interface ColorSelector {
  onChange?: (e: string) => void;
  placeholder?: string;
}

const ColorSelector = ({
  onChange,
  placeholder = '#ffffff',
}: ColorSelector) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(placeholder);
  const colorRef = React.useRef<HTMLDivElement>(null);
  const isFirstClickRef = React.useRef(true);

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    isFirstClickRef.current = true;
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Reset isFirstClickRef when the component unmounts
  React.useEffect(() => {
    return () => {
      isFirstClickRef.current = true;
    };
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (onChange) onChange(color);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('boop');
    setIsExpanded(false);
    setSelectedColor('none');
    if (onChange) onChange(selectedColor);
  };

  // Opening the Colorpicker for the first time counts as a click
  // We counteract this by ignoring the first click
  const handleOutsideClick = (event: MouseEvent) => {
    if (colorRef.current && !colorRef.current.contains(event.target as Node)) {
      if (!isFirstClickRef.current) setIsExpanded(false);
      isFirstClickRef.current = false;
    }
  };

  const handleExpandChange = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
    isFirstClickRef.current = true;
  };

  return (
    <div>
      <div className="minicolor-container">
        <div
          onClick={handleExpandChange}
          className="minicolor-color"
          style={{
            backgroundColor: selectedColor === 'none' ? '' : selectedColor,
          }}
        />
        <Flex className="minicolor-icon">
          <Pencil className="minicolor-change" onClick={handleExpandChange} />
          <Trash className="minicolor-clear" onClick={handleClear} />
        </Flex>
      </div>
      {isExpanded && (
        <div className="popover colorselect" ref={colorRef}>
          <HexColorPicker
            color={selectedColor}
            onChange={handleColorChange}
            className="colorpicker"
          />
          <div className="colorselect-menu">
            <X className="colorselect-close" onClick={handleExpandChange} />
            <Trash className="colorselect-close" onClick={handleClear} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
