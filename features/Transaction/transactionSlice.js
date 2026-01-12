import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getMyTransaction = createAsyncThunk(
  "transaction/getMyTransaction",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payments/my-transactions?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTransactionById = createAsyncThunk(
  "transaction/getTransactionById",
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payments/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    transactionDetail: null,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload?.data?.transactions || [];
        state.pagination = action.payload?.data?.pagination || null;
      })
      .addCase(getMyTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionDetail = action.payload?.data || null;
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
