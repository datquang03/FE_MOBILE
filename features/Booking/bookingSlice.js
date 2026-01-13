import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingPayload, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để đặt phòng");

      const {
        studioId,
        startTime,
        endTime,
        details,
        promoId,
        promoCode,
        discountAmount,
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
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || { message: "Đặt phòng thất bại" }
      );
    }
  }
);

export const singlePayment = createAsyncThunk(
  "booking/singlePayment",
  async ({ bookingId, percentage }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để đặt phòng");

      const response = await axiosInstance.post(
        `payments/create/${bookingId}`,
        { percentage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || { message: "Đặt phòng thất bại" }
      );
    }
  }
);
// 👉 THÊM ASYNC THUNK
export const createRemainingPayment = createAsyncThunk(
  "booking/createRemainingPayment",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để thanh toán");

      const response = await axiosInstance.post(
        `/payments/remaining/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || { message: "Thanh toán phần còn lại thất bại" }
      );
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "booking/getMyBookings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Bạn cần đăng nhập để xem lịch sử đặt phòng");
      const response = await axiosInstance.get("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || { message: "Lấy lịch sử đặt phòng thất bại" }
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token)
        throw new Error("Bạn cần đăng nhập để xem chi tiết đặt phòng");
      const response = await axiosInstance.get(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(
        err.response?.data || { message: "Lấy chi tiết đặt phòng thất bại" }
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
    payment: null,
    paymentLoading: false,
    paymentError: null,
    bookings: [], // Đảm bảo bookings luôn tồn tại trong initialState
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
        state.booking =
          action.payload.data?.booking ||
          action.payload.booking ||
          action.payload;
        state.bookingError =
          action.payload?.success === false
            ? action?.payload.message || "Đặt phòng thất bại"
            : null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload?.message || "Đặt phòng thất bại";
      })
      .addCase(singlePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(singlePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (action.payload?.success === true) {
          state.payment = action.payload.data;
          state.paymentError = null;
        } else {
          state.payment = null;
          state.paymentError = action.payload?.message || "Thanh toán thất bại";
        }
      })
      .addCase(singlePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.payment = null;
        state.paymentError = action.payload?.message || "Thanh toán thất bại";
      })
      .addCase(getMyBookings.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookings = action.payload.data?.items || []; // Lưu đúng mảng items vào state.bookings
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError =
          action.payload?.message || "Lấy lịch sử đặt phòng thất bại";
      })
      .addCase(getBookingById.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
        state.bookingDetail = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingDetail = action.payload; // Lưu đúng toàn bộ object trả về
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError =
          action.payload?.message || "Lấy chi tiết đặt phòng thất bại";
        state.bookingDetail = null;
      })
      // 👉 THÊM VÀO extraReducers
      .addCase(createRemainingPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createRemainingPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (action.payload?.success === true) {
          state.payment = action.payload.data;
          state.paymentError = null;
        } else {
          state.payment = null;
          state.paymentError =
            action.payload?.message || "Thanh toán phần còn lại thất bại";
        }
      })
      .addCase(createRemainingPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.payment = null;
        state.paymentError =
          action.payload?.message || "Thanh toán phần còn lại thất bại";
      });
  },
});

export default bookingSlice.reducer;
