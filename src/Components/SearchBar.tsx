import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch, style }) => {
  const [query, setQuery] = useState<string>('');
  
  // Use a debounce effect to delay the search call
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        onSearch(query); // Trigger search after user stops typing
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on component unmount or query change
  }, [query, onSearch]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Update query as user types
  };

  return (
    <Box sx={{ ...style, alignItems: 'center', width: '300px' }}>
      <TextField
        placeholder={placeholder}
        value={query}
        onChange={handleInput}
        sx={{ width: '100%' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default SearchBar;
