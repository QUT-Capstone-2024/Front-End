import React, { useState } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
    const [query, setQuery] = useState<string>('');

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <>
             <Box sx={{ display: 'flex', 
                alignItems: 'center', 
                width: '300px', 
                borderRadius: '10px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                }}>
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
        </>
    );
};

export default SearchBar;