import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../api/axiosInstance";

// === UTILS STORAGE ===
const saveCustomerToStorage = async (customer) => {
  if (customer) await AsyncStorage.setItem("customer", JSON.stringify(customer));
};

const loadCustomerFromStorage = async () => {
  try {
    const customer = await AsyncStorage.getItem("customer");
    return customer ? JSON.parse(customer) : null;
  } catch {
    return null;
  }
};

const clearCustomerStorage = async () => {
  await AsyncStorage.removeItem("customer");
};

// === INITIAL STATE ===
const initialState = {
  customer: null,
  loading: false,
  error: null,
  hydrated: false,
};

// Hydrate customer from AsyncStorage
export const hydrateCustomer = createAsyncThunk(
  "customer/hydrate",
  async () => {
    return await loadCustomerFromStorage();
  }
);

// 1️⃣ Lấy thông tin profile của customer
export const getMyProfile = createAsyncThunk(
  "customer/getMyProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token available");

      const response = await axiosInstance.get("/customers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không thể lấy thông tin hồ sơ" }
      );
    }
  }
);

// 2️⃣ Cập nhật profile
export const updateProfile = createAsyncThunk(
  "customer/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token available");

      const response = await axiosInstance.patch("/customers/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Cập nhật hồ sơ thất bại" }
      );
    }
  }
);

// 3️⃣ Xóa tài khoản
export const deleteMyAccount = createAsyncThunk(
  "customer/deleteMyAccount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token available");

      const response = await axiosInstance.delete("/customers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Xóa tài khoản thất bại" }
      );
    }
  }
);

// === SLICE ===
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomerData: (state) => {
      state.customer = null;
      clearCustomerStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // HYDRATE
      .addCase(hydrateCustomer.fulfilled, (state, action) => {
        state.customer = action.payload;
        state.hydrated = true;
      })
      .addCase(hydrateCustomer.rejected, (state) => {
        state.hydrated = true;
      })
      // GET MY PROFILE
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
        saveCustomerToStorage(state.customer);
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
        saveCustomerToStorage(state.customer);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE MY ACCOUNT
      .addCase(deleteMyAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMyAccount.fulfilled, (state) => {
        state.loading = false;
        state.customer = null;
        clearCustomerStorage();
      })
      .addCase(deleteMyAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerData } = customerSlice.actions;
export default customerSlice.reducer;
