import React, { ChangeEvent } from 'react';
import './Search.css';

interface Search {
  onChange: (e: string) => void;
  className?: string;
  placeholder?: string;
}

const Search = ({ onChange, className, placeholder = 'Search' }: Search) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query: string = event.target.value;
    setSearchQuery(query);
    onChange(query);
  };

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={`search-input ${className}`}
    />
  );
};

export default Search;
