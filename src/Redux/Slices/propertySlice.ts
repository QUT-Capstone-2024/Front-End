import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PropertyState {
  selectedPropertyId: number | null;
  propertySlug: string | null;
}

const initialState: PropertyState = {
  selectedPropertyId: null,
  propertySlug: null,
};

// Helper function to create a slug from the address
const createPropertySlug = (address: string) => {
  return address.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const propertySlice = createSlice({
  name: 'currentProperty',
  initialState,
  reducers: {
    selectProperty(state, action: PayloadAction<{ propertyId: number; propertyAddress: string }>) {
      state.selectedPropertyId = action.payload.propertyId;
      state.propertySlug = createPropertySlug(action.payload.propertyAddress);
    },
    clearSelectedProperty(state) {
      state.selectedPropertyId = null;
      state.propertySlug = null;
    },
  },
});

export const { selectProperty, clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
