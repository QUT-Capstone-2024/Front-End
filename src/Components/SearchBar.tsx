import React, { useState } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch, style }) => {
  const [query, setQuery] = useState<string>('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query); // Pass the query back to the parent component
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
              <Search onClick={handleSearch} />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default SearchBar;
