import mongoose from "mongoose";
const { Schema } = mongoose;

const chatRoomSchema = new Schema(
  {
    // The relationship that created this chat room
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Connection',
      required: true,
      index: true
    },

    // Users who are allowed to participate in this room
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],

    // When the latest message was sent
    lastMessageAt: {
      type: Date,
      default: null,
      index: true
    },

    // Reference to the most recent message
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },

    // Unread message counters per user
    unreadCounts: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        count: {
          type: Number,
          default: 0
        }
      }
    ],

    // If the chatroom is active or archived
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);


export default mongoose.model('ChatRoom', chatRoomSchema);