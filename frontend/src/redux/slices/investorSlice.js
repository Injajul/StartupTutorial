import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createInvestorProfileAPI,
  updateInvestorProfileAPI,
  getInvestorProfileByUserIdAPI,
  searchInvestorsAPI,
} from "../api/investorApi";

/* ======================================
   THUNKS
====================================== */

// Create investor profile
export const createInvestorProfile = createAsyncThunk(
  "investor/createProfile",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await createInvestorProfileAPI(data, token);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update investor profile
export const updateInvestorProfile = createAsyncThunk(
  "investor/updateProfile",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await updateInvestorProfileAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get investor profile by userId (public)
export const getInvestorProfileByUserId = createAsyncThunk(
  "investor/getByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getInvestorProfileByUserIdAPI(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Search investors (public)
export const searchInvestors = createAsyncThunk(
  "investor/search",
  async ({ filters, token }, { rejectWithValue }) => {
    try {
      const res = await searchInvestorsAPI(filters, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


/* ======================================
   SLICE
====================================== */

const investorSlice = createSlice({
  name: "investor",
  initialState: {
    myProfile: null,
    viewedProfile: null,
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearInvestorError(state) {
      state.error = null;
    },
    clearViewedInvestorProfile(state) {
      state.viewedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createInvestorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvestorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(createInvestorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateInvestorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvestorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(updateInvestorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By UserId
      .addCase(getInvestorProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvestorProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(getInvestorProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search
      .addCase(searchInvestors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInvestors.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchInvestors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvestorError, clearViewedInvestorProfile } =
  investorSlice.actions;

export default investorSlice.reducer;