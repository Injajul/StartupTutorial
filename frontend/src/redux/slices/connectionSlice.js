import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyConnectionsAPI,
  getConnectionByIdAPI,
} from "../api/connectionApi";

/* ======================================
   THUNKS
====================================== */

// Get my connections
export const getMyConnections = createAsyncThunk(
  "connection/getMyConnections",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getMyConnectionsAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single connection
export const getConnectionById = createAsyncThunk(
  "connection/getById",
  async ({ connectionId, token }, { rejectWithValue }) => {
    try {
      const res = await getConnectionByIdAPI(connectionId, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ======================================
   SLICE
====================================== */

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    list: [],
    activeConnection: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearConnectionError(state) {
      state.error = null;
    },
    clearActiveConnection(state) {
      state.activeConnection = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Get my connections
      .addCase(getMyConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get single connection
      .addCase(getConnectionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConnectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeConnection = action.payload;
      })
      .addCase(getConnectionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearConnectionError,
  clearActiveConnection,
} = connectionSlice.actions;

export default connectionSlice.reducer;