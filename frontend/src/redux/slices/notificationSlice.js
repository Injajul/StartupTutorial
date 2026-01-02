import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyNotificationsAPI,
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
  deleteNotificationAPI,
} from "../api/notificationApi";

/* ======================================
   THUNKS
====================================== */

// Get my notifications
export const getMyNotifications = createAsyncThunk(
  "notification/getMy",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getMyNotificationsAPI(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Mark one notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notification/markRead",
  async ({ notificationId, token }, { rejectWithValue }) => {
    try {
      const res = await markNotificationAsReadAPI(notificationId, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllRead",
  async (token, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsReadAPI(token);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async ({ notificationId, token }, { rejectWithValue }) => {
    try {
      await deleteNotificationAPI(notificationId, token);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ======================================
   SLICE
====================================== */

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotificationError(state) {
      state.error = null;
    },

    // 🔔 For socket-based real-time notifications
    receiveNotification(state, action) {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      // Get notifications
      .addCase(getMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark single read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // Mark all read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({
          ...n,
          isRead: true,
        }));
      })

      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (n) => n._id !== action.payload
        );
      });
  },
});

export const {
  clearNotificationError,
  receiveNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;