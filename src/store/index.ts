import { configureStore } from '@reduxjs/toolkit';

import spinnerReducer from './features/spinner.slice';
import userReducer from './features/user.slice';

export const store = configureStore({
  reducer: {
    spinner: spinnerReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
