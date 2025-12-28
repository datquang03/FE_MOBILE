// src/api/axiosInstance.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ưu tiên lấy URL từ biến môi trường Expo, fallback về endpoint mặc định
const apiUrl =
  process.env.EXPO_PUBLIC_API_URL?.trim() || "https://screwbe.duckdns.org/api";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// === TỰ ĐỘNG THÊM TOKEN (React Native dùng AsyncStorage) ===
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === XỬ LÝ LỖI 401 (hết hạn token) ===
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["token", "user"]);
      // TODO: Dispatch logout + navigate về màn hình login ở layer gọi API
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
