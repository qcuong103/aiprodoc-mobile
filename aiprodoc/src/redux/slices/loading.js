import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: draft => {
      draft.loading = true;
    },
    stopLoading: draft => {
      draft.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {startLoading, stopLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
