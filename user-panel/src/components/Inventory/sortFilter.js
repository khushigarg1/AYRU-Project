import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export const SortFilter = ({ value, onChange }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>Sort By</InputLabel>
    <Select value={value} onChange={onChange} label="Sort By">
      <MenuItem value="low_to_high">Price: Low to High</MenuItem>
      <MenuItem value="high_to_low">Price: High to Low</MenuItem>
    </Select>
  </FormControl>
);
