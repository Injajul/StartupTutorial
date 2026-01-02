import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRecommendedFoundersAPI,
  getRecommendedInvestorsAPI,
} from "../api/recommendationApi";

/* ======================================
   THUNKS
====================================== */

// 🔹 Recommend Co-founders
export const fetchRecommendedFounders = createAsyncThunk(
  "recommendations/founders",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getRecommendedFoundersAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load founder recommendations"
      );
    }
  }
);

// 🔹 Recommend Investors
export const fetchRecommendedInvestors = createAsyncThunk(
  "recommendations/investors",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getRecommendedInvestorsAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load investor recommendations"
      );
    }
  }
);


const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    founders: [],
    investors: [],
    loadingFounders: false,
    loadingInvestors: false,
    error: null,
  },
  reducers: {
    clearRecommendations: (state) => {
      state.founders = [];
      state.investors = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ======================================
         FOUNDERS
      ====================================== */
      .addCase(fetchRecommendedFounders.pending, (state) => {
        state.loadingFounders = true;
        state.error = null;
      })
      .addCase(fetchRecommendedFounders.fulfilled, (state, action) => {
        state.loadingFounders = false;
        state.founders = action.payload?.data || [];
      })
      .addCase(fetchRecommendedFounders.rejected, (state, action) => {
        state.loadingFounders = false;
        state.error = action.payload;
      })

      /* ======================================
         INVESTORS
      ====================================== */
      .addCase(fetchRecommendedInvestors.pending, (state) => {
        state.loadingInvestors = true;
        state.error = null;
      })
      .addCase(fetchRecommendedInvestors.fulfilled, (state, action) => {
        state.loadingInvestors = false;
        state.investors = action.payload?.data || [];
      })
      .addCase(fetchRecommendedInvestors.rejected, (state, action) => {
        state.loadingInvestors = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer;