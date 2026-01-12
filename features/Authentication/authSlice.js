// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../api/axiosInstance";

// IMPORT ĐỂ ĐỒNG BỘ AVATAR + PROFILE
import { uploadAvatar } from "../Upload/uploadSlice";
import { updateProfile } from "../Customer/customerSlice";

// ================= UTILS =================
const saveToStorage = async (user, token) => {
  if (user) await AsyncStorage.setItem("user", JSON.stringify(user));
  if (token) await AsyncStorage.setItem("token", token);
};

const loadFromStorage = async () => {
  try {
    const [user, token] = await Promise.all([
      AsyncStorage.getItem("user"),
      AsyncStorage.getItem("token"),
    ]);
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

const clearStorage = async () => {
  await AsyncStorage.multiRemove([
    "user",
    "token",
    "refreshToken",
    "pendingEmail",
  ]);
};

// ================= INITIAL STATE =================
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  hydrated: false,
};

// ================= HYDRATE =================
export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  return loadFromStorage();
});

// ================= THUNKS =================
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register/customer", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng ký thất bại" }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify", { email, code });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "OTP không hợp lệ" }
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/resend-code", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Gửi OTP thất bại" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { user, accessToken, refreshToken } = res.data.data;
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await saveToStorage(user, accessToken);
      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng nhập thất bại" }
      );
    }
  }
);

export const loginGoogle = createAsyncThunk(
  "auth/loginGoogle",
  async (googleToken, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login/google", { token: googleToken });
      const { user, accessToken, refreshToken } = res.data.data;
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await saveToStorage(user, accessToken);
      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng nhập Google thất bại" }
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token");
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Không lấy được user" }
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axiosInstance.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      const payload = err.response?.data || {
        message: "Đổi mật khẩu thất bại",
      };
      payload.status = err.response?.status;
      return rejectWithValue(payload);
    }
  }
);

export const registerStaff = createAsyncThunk(
  "auth/registerStaff",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register/staff", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Đăng ký staff thất bại" }
      );
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      await clearStorage();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Đăng xuất thất bại" });
    }
  }
);

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      clearStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== HYDRATE =====
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.hydrated = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.hydrated = true;
      })

      // ===== REGISTER =====
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const email = action.meta.arg.email;
        state.user = { ...action.payload.user, email, verified: false };
        saveToStorage(state.user, null);
        AsyncStorage.setItem("pendingEmail", email);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== VERIFY OTP =====
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        if (state.user) state.user.verified = true;
        saveToStorage(state.user, null);
        AsyncStorage.removeItem("pendingEmail");
      })

      // ===== LOGIN =====
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, verified: true };
        state.token = action.payload.accessToken;
        saveToStorage(state.user, state.token);
      })

      // ===== LOGIN GOOGLE =====
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, verified: true };
        state.token = action.payload.accessToken;
        saveToStorage(state.user, state.token);
      })

      // ===== GET CURRENT USER =====
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        saveToStorage(state.user, state.token);
      })

      // ===== CHANGE PASSWORD =====
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.status === 401) {
          state.user = null;
          state.token = null;
          clearStorage();
        }
      })

      // ===== REGISTER STAFF =====
      .addCase(registerStaff.fulfilled, (state, action) => {
        state.loading = false;
        const email = action.meta.arg.email;
        state.user = { ...action.payload.user, email, verified: false };
        saveToStorage(state.user, null);
        AsyncStorage.setItem("pendingEmail", email);
      })

      // ================== 🔥 SYNC AVATAR ==================
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        const avatar =
          action.payload?.avatarUrl || action.payload?.url || action.payload;

        if (state.user && avatar) {
          state.user.avatar = avatar;
          saveToStorage(state.user, state.token);
        }
      })

      // ================== 🔥 SYNC PROFILE ==================
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          saveToStorage(state.user, state.token);
        }
      })

      // ===== LOGOUT ASYNC =====
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
