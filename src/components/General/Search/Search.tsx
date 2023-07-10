import React from 'react';
import './Search.css';

interface Search {
  onChange: Function;
  className?: string;
  placeholder?: string;
}

const Search = ({ onChange, className, placeholder = 'Search' }: Search) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleInputChange = (event: any) => {
    const query = event.target.value;
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
