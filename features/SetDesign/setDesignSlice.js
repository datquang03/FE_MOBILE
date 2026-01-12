import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =========================
   THUNKS
========================= */

/**
 * Lấy set design đang active
 */
export const getActiveSetDesign = createAsyncThunk(
  "setDesign/getActiveSetDesign",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/set-designs/active");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Lấy custom set design đã convert của user
 */
export const getOwnCustomSetDesign = createAsyncThunk(
  "setDesign/getOwnCustomSetDesign",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/set-designs/custom-request?${page}&limit=${limit}`
      );
      return res.data; // { success, data, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Lấy custom set design theo id
 */
export const getOwnCustomSetDesignById = createAsyncThunk(
  "setDesign/getOwnCustomSetDesignById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/set-designs/custom-requests/${id}`);
      return res.data; // { success, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const setDesignSlice = createSlice({
  name: "setDesign",
  initialState: {
    /* Active set design */
    setDesigns: [],
    activeLoading: false,
    activeError: null,

    /* Custom converted set design */
    customSetDesigns: [],
    pagination: null,
    customLoading: false,
    customError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ================= ACTIVE ================= */
      .addCase(getActiveSetDesign.pending, (state) => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(getActiveSetDesign.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.setDesigns = action.payload;
      })
      .addCase(getActiveSetDesign.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = action.payload;
      })

      /* ================= CUSTOM ================= */
      .addCase(getOwnCustomSetDesign.pending, (state) => {
        state.customLoading = true;
        state.customError = null;
      })
      .addCase(getOwnCustomSetDesign.fulfilled, (state, action) => {
        state.customLoading = false;
        state.customSetDesigns = action.payload.data; // ✅ ĐÚNG FORMAT POSTMAN
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getOwnCustomSetDesign.rejected, (state, action) => {
        state.customLoading = false;
        state.customError = action.payload;
      });
  },
});

export default setDesignSlice.reducer;
