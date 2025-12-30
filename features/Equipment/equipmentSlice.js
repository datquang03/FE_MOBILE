import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getAllEquipments = createAsyncThunk(
  "equipment/getAllEquipments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/equipment");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const equipmentSlice = createSlice({
  name: "equipment",
  initialState: {
    equipments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEquipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.equipments = action.payload;
      })
      .addCase(getAllEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default equipmentSlice.reducer;
