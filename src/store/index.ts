import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import deviceReducer from './features/device.slice';
import spinnerReducer from './features/spinner.slice';
import userReducer from './features/user.slice';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    device: deviceReducer,
    spinner: spinnerReducer,
    user: userReducer,
  }),
);

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        REHYDRATE,
      ],
    },
  }),
  reducer: persistedReducer,
});

export const persistedStore = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;