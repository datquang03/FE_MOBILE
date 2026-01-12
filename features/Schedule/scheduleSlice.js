import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Lấy tất cả schedules
export const getSchedules = createAsyncThunk(
  "schedule/getSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/studios/schedule");
      return res.data.data; // backend trả về array hoặc object
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Không thể lấy danh sách lịch" });
    }
  }
);

// Lấy 1 schedule theo id
export const getScheduleById = createAsyncThunk(
  "schedule/getScheduleById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/schedules/${id}`);
      return res.data.data; // backend trả về object
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Không thể lấy lịch" });
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    schedules: [],
    currentSchedule: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(getSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSchedule = action.payload;
      })
      .addCase(getScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default scheduleSlice.reducer;