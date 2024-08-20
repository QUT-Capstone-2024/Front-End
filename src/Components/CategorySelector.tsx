import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import { ImageTags } from '../Constants/ImageTags';

interface CategorySelectorProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: boolean;
  helperText?: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  label, 
  value, 
  onChange, 
  error = false, 
  helperText = '',
}) => {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        MenuProps={MenuProps}
      >
        {ImageTags.map((tag) => (
          <MenuItem key={tag.key} value={tag.key.toString()}>
            {tag.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CategorySelector;
