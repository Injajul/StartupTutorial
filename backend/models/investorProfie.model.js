import mongoose from "mongoose";
const { Schema } = mongoose;

const investorProfileSchema = new Schema(
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

    investorType: {
      type: String,
      enum: [
        "angel",
        "vc",
        "syndicate",
        "corporate",
        "accelerator",
        "family-office",
      ],
    },
    investmentThesis: {
      type: String,
      maxlength: 3000,
    },

    checkSizeMin: {
      type: Number,
      min: 0,
    },

    checkSizeMax: {
      type: Number,
      min: 0,
    },

    preferredStages: [
      {
        type: String,
        enum: ["idea", "pre-seed", "seed", "series-a", "series-b", "growth"],
      },
    ],

    preferredIndustries: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    geographyPreference: [
      {
        type: String,
        trim: true,
      },
    ],

    pastInvestments: [
      {
        company: String,
        industry: String,
        amount: Number,
        year: Number,
      },
    ],
    links: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InvestorProfile", investorProfileSchema);