import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    // Who is receiving this notification
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Who triggered this (optional for system notifications)
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // What kind of notification is it?
    type: {
      type: String,
      enum: [
        "match_request_received",
        "match_request_accepted",
        "match_request_rejected",
        "new_message",
        "connection_created",
        "profile_view",
        "system",
        "recommendation",
      ],
      required: true,
    },

    // Context of what this notification refers to: message, connection, matchRequest, chatRoom, etc.
    entityId: {
      type: Schema.Types.ObjectId,
    },

    entityType: {
      type: String,
      enum: [
        "MatchRequest",
        "Connection",
        "ChatRoom",
        "Message",
        "User",
        "System",
      ],
    },

    // Human-readable text shown to the user
    message: {
      type: String,
      maxlength: 500,
    },

    // Whether the user has seen it
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);