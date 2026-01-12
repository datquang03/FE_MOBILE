import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) throw new Error("Bạn cần đăng nhập để xem thông báo");
      const response = await axiosInstance.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notification/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/notifications/${id}/read`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      // Sau khi xóa thành công, gọi lại getNotifications để cập nhật danh sách
      dispatch(getNotifications({ page: 1 }));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex(n => n._id === action.payload.id);
        if (idx !== -1) state.notifications[idx].read = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      });
  },
});

export default notificationSlice.reducer;
