import mongoose from "mongoose";
const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    // Two users who are connected (founder–cofounder or founder–investor)
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Connection schema
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
    },

    // What type of relationship they have
    type: {
      type: String,
      enum: ["cofounder", "investor"],
      required: true,
      index: true,
    },

    // Which MatchRequest created this connection
    createdFromRequestId: {
      type: Schema.Types.ObjectId,
      ref: "MatchRequest",
      index: true,
    },

    // Chat / Interaction metadata
    lastInteractionAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    lastMessageSnippet: {
      type: String,
      maxlength: 500,
    },

    // Per-user unread message counts
    unreadCounts: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Connection", connectionSchema);