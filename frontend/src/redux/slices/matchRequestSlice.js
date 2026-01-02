import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMatchRequestAPI,
  getIncomingMatchRequestsAPI,
  getSentMatchRequestsAPI,
  respondToMatchRequestAPI,
  cancelMatchRequestAPI,
} from "../api/matchRequestApi";

/* ============================
   THUNKS
============================ */

// Send match request
export const sendMatchRequest = createAsyncThunk(
  "matchRequest/send",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await sendMatchRequestAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get incoming
export const getIncomingMatchRequests = createAsyncThunk(
  "matchRequest/getIncoming",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getIncomingMatchRequestsAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get sent
export const getSentMatchRequests = createAsyncThunk(
  "matchRequest/getSent",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getSentMatchRequestsAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Respond
export const respondToMatchRequest = createAsyncThunk(
  "matchRequest/respond",
  async ({ requestId, action, token }, { rejectWithValue }) => {
    try {
      const res = await respondToMatchRequestAPI(requestId, action, token);
      return { requestId, action, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Cancel
export const cancelMatchRequest = createAsyncThunk(
  "matchRequest/cancel",
  async ({ requestId, token }, { rejectWithValue }) => {
    try {
      await cancelMatchRequestAPI(requestId, token);
      return requestId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ============================
   SLICE
============================ */

const matchRequestSlice = createSlice({
  name: "matchRequest",
  initialState: {
    incoming: [],
    sent: [],

    loadingSent: false,
    loadingIncoming: false,
    sending: false,

    error: null,
  },
  reducers: {
    clearMatchRequestError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== SEND ===== */
      .addCase(sendMatchRequest.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMatchRequest.fulfilled, (state, action) => {
        state.sending = false;

        // ✅ normalize & append ONLY if not already present
        const exists = state.sent.some(
          (req) => req._id === action.payload._id
        );

        if (!exists) {
          state.sent.unshift(action.payload);
        }
      })
      .addCase(sendMatchRequest.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })

      /* ===== SENT ===== */
      .addCase(getSentMatchRequests.pending, (state) => {
        state.loadingSent = true;
      })
      .addCase(getSentMatchRequests.fulfilled, (state, action) => {
        state.loadingSent = false;
        state.sent = action.payload; // authoritative source
      })
      .addCase(getSentMatchRequests.rejected, (state, action) => {
        state.loadingSent = false;
        state.error = action.payload;
      })

      /* ===== INCOMING ===== */
      .addCase(getIncomingMatchRequests.pending, (state) => {
        state.loadingIncoming = true;
      })
      .addCase(getIncomingMatchRequests.fulfilled, (state, action) => {
        state.loadingIncoming = false;
        state.incoming = action.payload;
      })
      .addCase(getIncomingMatchRequests.rejected, (state, action) => {
        state.loadingIncoming = false;
        state.error = action.payload;
      })

      /* ===== RESPOND ===== */
      .addCase(respondToMatchRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.incoming = state.incoming.filter(
          (req) => req._id !== requestId
        );
      })

      /* ===== CANCEL ===== */
      .addCase(cancelMatchRequest.fulfilled, (state, action) => {
        state.sent = state.sent.filter(
          (req) => req._id !== action.payload
        );
      });
  },
});

export const { clearMatchRequestError } = matchRequestSlice.actions;
export default matchRequestSlice.reducer;