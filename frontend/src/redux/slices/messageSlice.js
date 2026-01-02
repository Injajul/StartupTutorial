import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendMessageAPI,
  getMessagesByRoomAPI,
} from "../api/messageApi";

/* ======================================
   THUNKS
====================================== */

// Send message
export const sendMessage = createAsyncThunk(
  "message/send",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await sendMessageAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get messages by room
export const getMessagesByRoom = createAsyncThunk(
  "message/getByRoom",
  async ({ roomId, token }, { rejectWithValue }) => {
    try {
      const res = await getMessagesByRoomAPI(roomId, token);
      return { roomId, messages: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ======================================
   SLICE
====================================== */

const messageSlice = createSlice({
  name: "message",
  initialState: {
    byRoom: {},        // { roomId: [messages] }
    loading: false,
    error: null,
  },
  reducers: {
    clearMessageError(state) {
      state.error = null;
    },

    // 🔴 Used by socket.io (real-time)
    receiveMessage(state, action) {
      const message = action.payload;
      const roomId = message.roomId;

      if (!state.byRoom[roomId]) {
        state.byRoom[roomId] = [];
      }

      state.byRoom[roomId].push(message);
    },

    clearMessagesForRoom(state, action) {
      delete state.byRoom[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder

      // Send
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        const message = action.payload;
        const roomId = message.roomId;

        if (!state.byRoom[roomId]) {
          state.byRoom[roomId] = [];
        }

        state.byRoom[roomId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by room
      .addCase(getMessagesByRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesByRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.byRoom[action.payload.roomId] = action.payload.messages;
      })
      .addCase(getMessagesByRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearMessageError,
  receiveMessage,
  clearMessagesForRoom,
} = messageSlice.actions;

export default messageSlice.reducer;