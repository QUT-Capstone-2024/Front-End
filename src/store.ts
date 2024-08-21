import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Redux/authSlice';
import helpReducer from './Redux/helpSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    help: helpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
