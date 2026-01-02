import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChatRoomAPI,
  getMyChatRoomsAPI,
  archiveChatRoomAPI,
} from "../api/chatRoomApi";

/* ======================================
   THUNKS
====================================== */

// Create chat room
export const createChatRoom = createAsyncThunk(
  "chatRoom/create",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await createChatRoomAPI(data, token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get my chat rooms
export const getMyChatRooms = createAsyncThunk(
  "chatRoom/getMyRooms",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getMyChatRoomsAPI(token);
      console.log("res.data",res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Archive chat room
export const archiveChatRoom = createAsyncThunk(
  "chatRoom/archive",
  async ({ roomId, token }, { rejectWithValue }) => {
    try {
      const res = await archiveChatRoomAPI(roomId, token);
      return res.data.roomId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ======================================
   SLICE
====================================== */

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState: {
    rooms: [],
    activeRoom: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveRoom(state, action) {
      state.activeRoom = action.payload;
    },
    clearActiveRoom(state) {
      state.activeRoom = null;
    },
    clearChatRoomError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create room
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;

        // Prevent duplicates
        const exists = state.rooms.some(
          (room) => room._id === action.payload._id
        );

        if (!exists) {
          state.rooms.unshift(action.payload);
        }

        state.activeRoom = action.payload;
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get my rooms
      .addCase(getMyChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getMyChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Archive room
      .addCase(archiveChatRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(
          (room) => room._id !== action.payload
        );

        if (state.activeRoom?._id === action.payload) {
          state.activeRoom = null;
        }
      });
  },
});

export const {
  setActiveRoom,
  clearActiveRoom,
  clearChatRoomError,
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;