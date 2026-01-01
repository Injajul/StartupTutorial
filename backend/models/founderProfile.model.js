import mongoose from "mongoose";
const { Schema } = mongoose;

const founderProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    location: {
      country: String,
      city: String,
    },

    commitmentLevel: {
      type: String,
      enum: ["full-time", "part-time", "weekends-only", "advisor"],
      required: true,
    },
    // Core founder attributes
    skills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    interests: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    industryTags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    startupStage: {
      type: String,
      enum: ["idea", "pre-seed", "seed", "series-a", "scale", "mature"],
    },

    yearsExperience: {
      type: Number,
      min: 0,
    },
    fundingStatus: {
      type: String,
      enum: ["bootstrapped", "friends-family", "angel", "vc", "none"],
    },
    teamSize: {
      type: Number,
      min: 1,
    },

    // Matching preferences
    lookingForCofounder: {
      type: Boolean,
      default: false,
    },

    preferredCofounderSkills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    preferredCofounderExperience: {
      type: Number,
      min: 0,
    },

    startupDescription: {
      type: String,
      maxlength: 2000,
    },
    equityOffered: {
      min: { type: Number, min: 0, max: 100 },
      max: { type: Number, min: 0, max: 100 },
      negotiable: { type: Boolean, default: true },
    },
    links: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FounderProfile", founderProfileSchema);