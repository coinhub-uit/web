import { PlanAvailableDto } from '@/types/plans';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SavingState {
  availablePlans: PlanAvailableDto[];
}

const initialState: SavingState = {
  availablePlans: [],
};

const savingSlice = createSlice({
  name: 'saving',
  initialState,
  reducers: {
    setAvailablePlans(state, action: PayloadAction<PlanAvailableDto[]>) {
      state.availablePlans = action.payload;
    },
  },
});

export const { setAvailablePlans } = savingSlice.actions;
export default savingSlice.reducer;
