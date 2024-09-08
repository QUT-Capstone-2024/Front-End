import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import userReducer from './Slices/userSlice';
import helpReducer from './Slices/helpSlice';
import propertyReducer from './Slices/propertySlice';

const rootReducer = combineReducers({
  user: userReducer,
  help: helpReducer,
  currentProperty: propertyReducer,
});

const persistConfig = {
  key: 'root',              // Key for storage
  storage: storageSession,  // Use sessionStorage for persistence
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
