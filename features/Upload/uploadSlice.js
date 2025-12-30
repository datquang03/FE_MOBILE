import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =====================================================
   HELPER – BUILD FORMDATA (SAFE)
===================================================== */
const buildFormData = (key, files) => {
  if (!files) return null;

  const arr = Array.isArray(files) ? files : [files];
  const formData = new FormData();

  arr.forEach((f) => {
    if (!f?.uri) return;

    formData.append(key, {
      uri: f.uri,
      name: f.name || `file_${Date.now()}`,
      type: f.type || "image/jpeg",
    });
  });

  return formData;
};

/* =====================================================
   BASE UPLOAD HANDLER
===================================================== */
const uploadHandler = async ({
  url,
  key,
  file,
  token,
  timeout,
  rejectWithValue,
}) => {
  if (!file || (Array.isArray(file) && file.length === 0)) {
    return rejectWithValue({ message: `No ${key} file provided` });
  }

  const formData = buildFormData(key, file);
  if (!formData) {
    return rejectWithValue({ message: `Invalid ${key} file` });
  }

  const res = await axiosInstance.post(url, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    timeout,
  });

  return res.data?.data || res.data;
};

/* =====================================================
   THUNKS
===================================================== */
export const uploadAvatar = createAsyncThunk(
  "upload/uploadAvatar",
  async (file, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
      const { token } = getState().auth;
      const res = await axiosInstance.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return res.data;
    } catch (err) {
      // Hiển thị chi tiết lỗi trả về từ server nếu có
      let message = err?.message || "Upload avatar failed";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.response?.data) {
        message = JSON.stringify(err.response.data);
      } else if (typeof err === 'string') {
        message = err;
      }
      Alert.alert("Lỗi", message);
      // Log chi tiết lỗi ra console để debug
      console.log('Upload avatar error:', err, err?.response?.data);
      return rejectWithValue(message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: "/upload/image",
        key: "image",
        file,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload ảnh thất bại" });
    }
  }
);

export const uploadImages = createAsyncThunk(
  "upload/uploadImages",
  async (files, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: "/upload/images",
        key: "images",
        file: files,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload ảnh thất bại" });
    }
  }
);

export const uploadStudioMedia = createAsyncThunk(
  "upload/uploadStudioMedia",
  async (file, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: "/upload/studio-media",
        key: "media",
        file,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload studio media thất bại" });
    }
  }
);

export const uploadEquipmentImage = createAsyncThunk(
  "upload/uploadEquipmentImage",
  async ({ equipmentId, file }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: `/upload/equipment/${equipmentId}/image`,
        key: "image",
        file,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload ảnh thiết bị thất bại" });
    }
  }
);

export const uploadReviewImages = createAsyncThunk(
  "upload/uploadReviewImages",
  async ({ reviewId, files }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: `/upload/review/${reviewId}/images`,
        key: "images",
        file: files,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload ảnh đánh giá thất bại" });
    }
  }
);

export const uploadSetDesignImages = createAsyncThunk(
  "upload/uploadSetDesignImages",
  async ({ setDesignId, files }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: `/upload/set-design/${setDesignId}/images`,
        key: "images",
        file: files,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload set design thất bại" });
    }
  }
);

export const uploadCustomerSetDesignImages = createAsyncThunk(
  "upload/uploadCustomerSetDesignImages",
  async (files, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      return await uploadHandler({
        url: "/set-designs/upload-images",
        key: "images",
        file: files,
        token,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload set design thất bại" });
    }
  }
);

export const uploadVideo = createAsyncThunk(
  "upload/uploadVideo",
  async (file, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      return await uploadHandler({
        url: "/upload/video",
        key: "video",
        file,
        token,
        timeout: 600000,
        rejectWithValue,
      });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Upload video thất bại" });
    }
  }
);

export const deleteFile = createAsyncThunk(
  "upload/deleteFile",
  async (publicId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axiosInstance.delete(`/upload/file/${publicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return publicId;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Xóa file thất bại" });
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    uploading: false,
    lastUploadedImages: [],
    lastUploadedVideo: null,
    error: null,
  },
  reducers: {
    clearUploadError: (state) => {
      state.error = null;
    },
    clearLastUploaded: (state) => {
      state.lastUploadedImages = [];
      state.lastUploadedVideo = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.uploading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.uploading = false;
      state.error = action.payload;
    };

    [
      uploadAvatar,
      uploadImage,
      uploadImages,
      uploadStudioMedia,
      uploadEquipmentImage,
      uploadReviewImages,
      uploadSetDesignImages,
      uploadCustomerSetDesignImages,
      uploadVideo,
    ].forEach((thunk) => {
      builder.addCase(thunk.pending, pending);
      builder.addCase(thunk.rejected, rejected);
      builder.addCase(thunk.fulfilled, (state, action) => {
        state.uploading = false;

        if (Array.isArray(action.payload)) {
          state.lastUploadedImages = action.payload;
        } else if (action.payload) {
          const file =
            action.payload.avatarUrl ||
            action.payload.url ||
            action.payload.secure_url ||
            action.payload;

          state.lastUploadedImages = file ? [file] : [];
        }
      });
    });

    builder.addCase(deleteFile.fulfilled, (state, action) => {
      state.lastUploadedImages = state.lastUploadedImages.filter(
        (img) => img.publicId !== action.payload
      );
    });
  },
});

export const { clearUploadError, clearLastUploaded } = uploadSlice.actions;
export default uploadSlice.reducer;
