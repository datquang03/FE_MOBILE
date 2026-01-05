import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingPayload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để đặt phòng");

      // Chuẩn hóa payload: chỉ gửi các trường backend cần
      const {
        studioId,
        startTime,
        endTime,
        details,
        promoId,
        promoCode,
        discountAmount
      } = bookingPayload;
      const payload = {
        studioId,
        startTime,
        endTime,
        ...(details && details.length > 0 ? { details } : {}),
        ...(promoId ? { promoId } : {}),
        ...(promoCode ? { promoCode } : {}),
        ...(discountAmount ? { discountAmount } : {}),
      };

      const response = await axiosInstance.post("/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Đúng chuẩn API: trả về response.data.data
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đặt phòng thất bại" }
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    booking: null,
    bookingLoading: false,
    bookingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        // Lấy booking từ action.payload.booking (chuẩn backend)
        state.booking = action.payload?.booking || action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        // Đảm bảo bookingError là message string
        state.bookingError = action.payload?.message || action.error?.message || "Đặt phòng thất bại";
      });
  },
});

export default bookingSlice.reducer;
