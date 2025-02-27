import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
  token: string | null;
}

const initialState: AdminState = {
  token: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { login, logout } = adminSlice.actions;
export default adminSlice.reducer;
