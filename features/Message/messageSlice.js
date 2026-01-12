import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* =======================
   GET CONVERSATIONS
======================= */
export const getConversation = createAsyncThunk(
  "message/getConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/messages/conversations"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* =======================
   GET MESSAGES BY CONVERSATION
======================= */
export const getMessage = createAsyncThunk(
  "message/getMessage",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/messages/conversation/${conversationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* =======================
   SLICE
======================= */
const messageSlice = createSlice({
  name: "message",
  initialState: {
    conversations: [],
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- conversations ---- */
      .addCase(getConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations =
          action.payload?.data || [];
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- messages ---- */
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Nếu API trả về { data: { messages: [...] } } thì lấy messages
        if (Array.isArray(action.payload?.data?.messages)) {
          state.messages = action.payload.data.messages;
        } else if (Array.isArray(action.payload?.data)) {
          state.messages = action.payload.data;
        } else {
          state.messages = [];
        }
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
