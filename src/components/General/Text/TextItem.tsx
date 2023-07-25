import React from 'react';

interface TextProps {
  children?: string;
  fontSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

const tags: Record<string, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

const TextItem = ({ children, fontSize = 'h5', className = '' }: TextProps) => {
  const TextComponent = tags[fontSize];

  return <TextComponent className={className}>{children}</TextComponent>;
};

export default TextItem;
