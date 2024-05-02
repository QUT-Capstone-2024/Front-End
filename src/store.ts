import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Redux/authSlice';

export type RootState = {
  auth: {
    isLoggedIn: boolean;
  };
};

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;