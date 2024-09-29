import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PropertyState {
  selectedPropertyId: number | null;
  propertyAddress: string | null;
  propertySlug: string | null;
  propertyDescription?: string | null;
  propertySize?: number | null;
  externalPropertySize?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking?: number | null;
  type?: string | null;
  approvalStatus?: string | null;
}

const initialState: PropertyState = {
  selectedPropertyId: null,
  propertyAddress: null,
  propertySlug: null,
  propertyDescription: null,
  propertySize: null,
  externalPropertySize: null,
  bedrooms: null,
  bathrooms: null,
  parking: null,
  type:  null,
  approvalStatus:  null,
};

// Helper function to create a slug from the address
const createPropertySlug = (address: string) => {
  return address.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

const propertySlice = createSlice({
  name: 'currentProperty',
  initialState,
  reducers: {
    selectProperty(state, action: PayloadAction<{ 
      propertyId: number;
      propertyAddress: string;
      propertyDescription: string;
      propertySize: number;
      externalPropertySize: number;
      bedrooms: number;
      bathrooms: number;
      parkingSpaces: number;
      propertyType: string;
      approvalStatus: string;  
    }>) {
      state.selectedPropertyId = action.payload.propertyId;
      state.propertyAddress = action.payload.propertyAddress;
      state.propertySlug = createPropertySlug(action.payload.propertyAddress); 
      state.propertyDescription = action.payload.propertyDescription;
      state.propertySize = action.payload.propertySize;
      state.externalPropertySize = action.payload.externalPropertySize;
      state.bedrooms = action.payload.bedrooms;
      state.bathrooms = action.payload.bathrooms;
      state.parking = action.payload.parkingSpaces;
      state.type = action.payload.propertyType;
      state.approvalStatus = action.payload.approvalStatus;
    },    
    clearSelectedProperty(state) {
      state = initialState;
    },
  },
});

export const { selectProperty, clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;
