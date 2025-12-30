import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getActiveStudio = createAsyncThunk(
  "studio/getActiveStudio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/studios/active?page=1&limit=10&search=&minPrice=&maxPrice=&minCapacity="
      );
      return response.data.data.studios;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudioById = createAsyncThunk(
  "studio/getStudioById",
  async (studioId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/studios/${studioId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStudioSchedule = createAsyncThunk(
  "studio/getStudioSchedule",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/studios/schedule");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const studioSlice = createSlice({
  name: "studio",
  initialState: {
    studios: [],
    loading: false,
    error: null,
    studioDetail: null,
    studioDetailLoading: false,
    studioDetailError: null,
    studioSchedule: null,
    studioScheduleLoading: false,
    studioScheduleError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActiveStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = action.payload;
      })
      .addCase(getActiveStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudioById.pending, (state) => {
        state.studioDetailLoading = true;
        state.studioDetailError = null;
        state.studioDetail = null;
      })
      .addCase(getStudioById.fulfilled, (state, action) => {
        state.studioDetailLoading = false;
        state.studioDetail = action.payload;
      })
      .addCase(getStudioById.rejected, (state, action) => {
        state.studioDetailLoading = false;
        state.studioDetailError = action.payload;
      })
      .addCase(getStudioSchedule.pending, (state) => {
        state.studioScheduleLoading = true;
        state.studioScheduleError = null;
        state.studioSchedule = null;
      })
      .addCase(getStudioSchedule.fulfilled, (state, action) => {
        state.studioScheduleLoading = false;
        state.studioSchedule = action.payload;
      })
      .addCase(getStudioSchedule.rejected, (state, action) => {
        state.studioScheduleLoading = false;
        state.studioScheduleError = action.payload;
      });
  },
});

export default studioSlice.reducer;
