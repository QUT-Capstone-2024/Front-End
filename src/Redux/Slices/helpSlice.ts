import { createSlice } from '@reduxjs/toolkit';

export const helpSlice = createSlice({
  name: 'help',
  initialState: {
    isOpen: false
  },
  reducers: {
    openHelp: state => {
      state.isOpen = true;
    },
    closeHelp: state => {
      state.isOpen = false;
    }
  }
});

export const { openHelp, closeHelp } = helpSlice.actions;

export default helpSlice.reducer;