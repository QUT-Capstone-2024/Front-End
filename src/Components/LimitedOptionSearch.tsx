import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const exampleFields = [
  { label: 'Collection Approved'},
  { label: 'Collection Queued'},
  { label: 'Collection Rejected'},
];

type LimitedOptionSearchProps = {
  allowedFields?: { label: string }[];
};

const LimitedOptionSearch: React.FC<LimitedOptionSearchProps> = ({ allowedFields = exampleFields }) => {
  return (
    <Autocomplete
      id="LimitedOptionSearch"
      options={allowedFields}
      getOptionLabel={(option) => option.label}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Search" variant="outlined" />}
    />
  );
};

export default LimitedOptionSearch;