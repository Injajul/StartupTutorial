import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    // Chat room this message belongs to
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    // Sender
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Recipient (for quick filtering, although room participants also store this)
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Main message content
    body: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // Attachments (images, docs, pitch decks, etc.)
    attachments: [
      {
        file: {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
        mimeType: {
          type: String,
          required: true,
        },
        meta: {
          type: Schema.Types.Mixed,
          default: {},
        },
      },
    ],

    // Read state
    isRead: {
      type: Boolean,
      default: false,
    },

    // If someone edits the message
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);