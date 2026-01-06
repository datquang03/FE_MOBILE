import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getActiveSetDesign = createAsyncThunk(
  "setDesign/getActiveSetDesign",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/set-designs/active");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const setDesignSlice = createSlice({
  name: "setDesign",
  initialState: {
    setDesigns: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActiveSetDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveSetDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.setDesigns = action.payload;
      })
      .addCase(getActiveSetDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default setDesignSlice.reducer;
