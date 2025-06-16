import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '@/lib/features/admin/adminSlice';
import savingReducer from '@/lib/features/saving/savingSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      admin: adminReducer,
      saving: savingReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
