import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/founderApi";

/* =====================================================
   THUNKS
===================================================== */

// CREATE
export const createFounderProfile = createAsyncThunk(
  "founder/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await api.createFounderProfileAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create founder profile"
      );
    }
  }
);

// Fetch all founders (public)
export const fetchAllFounders = createAsyncThunk(
  "founder/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchAllFoundersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// UPDATE
export const updateFounderProfile = createAsyncThunk(
  "founder/update",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await api.updateFounderProfileAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update founder profile"
      );
    }
  }
);

// GET BY USER ID (PUBLIC)
export const fetchFounderByUserId = createAsyncThunk(
  "founder/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getFounderProfileByUserIdAPI(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Founder not found"
      );
    }
  }
);

// 🌍 Search founders
export const searchFounders = createAsyncThunk(
  "founder/search",
  async ({ filters, token }, { rejectWithValue }) => {
    try {
      const res = await api.searchFoundersAPI(filters,token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Founder search failed"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const founderSlice = createSlice({
  name: "founder",
  initialState: {
    myProfile: null,
    allFounders: [],
    viewedProfile: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearFounderError: (state) => {
      state.error = null;
    },
    clearViewedFounder: (state) => {
      state.viewedProfile = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createFounderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFounderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(createFounderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateFounderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFounderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(updateFounderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH ALL FOUNDERS
      // ==============================
      .addCase(fetchAllFounders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFounders.fulfilled, (state, action) => {
        state.loading = false;
        state.allFounders = action.payload;
      })
      .addCase(fetchAllFounders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY USER ID
      .addCase(fetchFounderByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFounderByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(fetchFounderByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- SEARCH FOUNDERS ----
      .addCase(searchFounders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFounders.fulfilled, (state, action) => {
        state.loading = false;
        state.founders = action.payload;
      })
      .addCase(searchFounders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFounderError, clearViewedFounder } = founderSlice.actions;

export default founderSlice.reducer;