import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk để gọi API apply promotion
export const applyPromotion = createAsyncThunk(
  'promotion/applyPromotion',
  async ({ code, subtotal }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/promotions/apply', {
        code,
        subtotal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotion',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(applyPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(applyPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Có lỗi xảy ra';
        state.data = null;
      });
  },
});

export default promotionSlice.reducer;