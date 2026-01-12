import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createSearch = createAsyncThunk(
  "search/createSearch",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/search", { keyword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSearchSuggestions = createAsyncThunk(
  "search/getSearchSuggestions",
  async ({ keyword, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/search/suggestions?keyword=${encodeURIComponent(
          keyword
        )}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: {
      studios: [],
      equipment: [],
      services: [],
      promotions: [],
      setDesigns: [],
    },
    suggestions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = {
        studios: [],
        equipment: [],
        services: [],
        promotions: [],
        setDesigns: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload?.data?.data || {
          studios: [],
          equipment: [],
          services: [],
          promotions: [],
          setDesigns: [],
        };
      })
      .addCase(createSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload?.data || [];
      })
      .addCase(getSearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
