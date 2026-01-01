import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../api/userApi";

// --- Thunks ---

export const fetchCurrentAuthUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.CurrentAuthUser(token); // call the exported function
      console.log("CurrentUser", res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Auth check failed"
      );
    }
  }
);



// --- Slice ---

const userSlice = createSlice({
  name: "authUser",
  initialState: {
    users: [],
    viewingUser: null,
    currentAuthUser: null,
    loading: false,
    authUserLoading: false,
   
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Auth Check
      .addCase(fetchCurrentAuthUser.pending, (state) => {
        state.authUserLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentAuthUser.fulfilled, (state, action) => {
        state.currentAuthUser = action.payload;
        state.authUserLoading = false;
      })
      .addCase(fetchCurrentAuthUser.rejected, (state, action) => {
        state.error = action.payload;
        state.authUserLoading = false;
      })

     
  },
});
export const { clearError, reset } = userSlice.actions;
export default userSlice.reducer;