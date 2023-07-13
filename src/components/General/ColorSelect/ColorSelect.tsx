import React from 'react';
import { Pencil, X } from 'lucide-react';
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

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (typeof onChange === 'function') onChange(color);
  };

  const handleExpandChange = () => {
    setIsExpanded(!isExpanded);
  };

  const MinimizedColorSelect = () => {
    return (
      <Flex className="minicolor-container">
        <div
          className="minicolor-color"
          style={{ backgroundColor: selectedColor }}
        />
        <div className="minicolor-icon">
          <Pencil width={23} height={23} className="minicolor-change" />
        </div>
      </Flex>
    );
  };

  return (
    <div>
      {isExpanded ? (
        <Flex className="popover colorselect">
          <HexColorPicker color={selectedColor} onChange={handleColorChange} />
          <X className="colorselect-close" onClick={handleExpandChange} />
        </Flex>
      ) : (
        <div onClick={handleExpandChange}>
          <MinimizedColorSelect />
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
