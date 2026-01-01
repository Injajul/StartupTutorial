import mongoose from "mongoose";
const { Schema } = mongoose;

const matchRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["cofounder", "investor-to-founder", "founder-to-investor"],
      required: true,
      index: true,
    },

    message: {
      type: String,
      maxlength: 1000,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MatchRequest", matchRequestSchema);