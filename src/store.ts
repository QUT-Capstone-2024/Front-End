import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Redux/authSlice';
import helpReducer from './Redux/helpSlice';

export type RootState = {
  help: any;
  auth: {
    isLoggedIn: boolean;
  };
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    help: helpReducer,
  },
});

export default store;