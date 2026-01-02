import FounderProfile from "../models/founderProfile.model.js";
import User from "../models/user.model.js";
import InvestorProfile from "../models/investorProfie.model.js";

/**
 * GET /api/recommendations/founders
 * Recommend co-founders for the logged-in founder
 */
export const recommendFounders = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    // 1️⃣ Find current user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Find current founder profile
    const myProfile = await FounderProfile.findOne({ userId: user._id });
    if (!myProfile) {
      return res
        .status(400)
        .json({ message: "Founder profile not found" });
    }

    const {
      skills = [],
      interests = [],
      industryTags = [],
      preferredCofounderSkills = [],
      preferredCofounderExperience = 0,
    } = myProfile;

    // 3️⃣ Recommendation pipeline
    const recommendations = await FounderProfile.aggregate([
      {
        // Exclude self & require cofounder intent
        $match: {
          userId: { $ne: user._id },
          lookingForCofounder: true,
        },
      },

      // 4️⃣ Match metrics
      {
        $addFields: {
          skillMatchCount: {
            $size: { $setIntersection: ["$skills", skills] },
          },
          preferredSkillMatchCount: {
            $size: {
              $setIntersection: ["$skills", preferredCofounderSkills],
            },
          },
          interestMatchCount: {
            $size: { $setIntersection: ["$interests", interests] },
          },
          industryMatchCount: {
            $size: { $setIntersection: ["$industryTags", industryTags] },
          },
          experienceGap: {
            $abs: {
              $subtract: ["$yearsExperience", preferredCofounderExperience],
            },
          },
        },
      },

      // 5️⃣ Weighted score
      {
        $addFields: {
          matchScore: {
            $add: [
              { $multiply: ["$skillMatchCount", 3] },
              { $multiply: ["$preferredSkillMatchCount", 3] },
              { $multiply: ["$interestMatchCount", 2] },
              { $multiply: ["$industryMatchCount", 2] },
              {
                $cond: [{ $lte: ["$experienceGap", 1] }, 1, 0],
              },
            ],
          },
        },
      },

      // 6️⃣ Sort best → newest
      {
        $sort: {
          matchScore: -1,
          createdAt: -1,
        },
      },

      // 7️⃣ Limit
      { $limit: 20 },

      // 8️⃣ Populate user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // 9️⃣ FINAL PROJECTION (FULL PROFILE)
      {
        $project: {
          _id: 1,
          userId: 1,

          // User info (for cards)
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            avatarUrl: "$user.avatarUrl",
          },

          // Profile image
          profileImage: 1,

          // Core founder data
          skills: 1,
          interests: 1,
          industryTags: 1,
          startupStage: 1,
          yearsExperience: 1,
          commitmentLevel: 1,
          teamSize: 1,
          fundingStatus: 1,

          // Matching prefs
          lookingForCofounder: 1,
          preferredCofounderSkills: 1,
          preferredCofounderExperience: 1,

          // Business
          equityOffered: 1,
          startupDescription: 1,
          links: 1,
          location: 1,

          // Recommendation metadata
          matchScore: 1,
          createdAt: 1,
        },
      },
    ]);

    // 🔁 Fallback
    if (!recommendations.length) {
      const fallback = await FounderProfile.find({
        userId: { $ne: user._id },
        lookingForCofounder: true,
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "fullName avatarUrl")
        .lean();

      return res.status(200).json({
        type: "fallback",
        data: fallback,
      });
    }

    return res.status(200).json({
      type: "matched",
      data: recommendations,
    });
  } catch (error) {
    console.error("Founder recommendation error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



/**
 * GET /api/recommendations/investors
 * Recommend investors for the logged-in founder
 */
export const recommendInvestors = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    // 1️⃣ Logged-in user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Founder profile (recommend investors FOR founders)
    const founderProfile = await FounderProfile.findOne({
      userId: user._id,
    });

    if (!founderProfile) {
      return res
        .status(400)
        .json({ message: "Founder profile not found" });
    }

    const {
      industryTags = [],
      startupStage,
      location,
    } = founderProfile;

    const founderCountry = location?.country || null;

    // 3️⃣ Recommendation pipeline
    const investors = await InvestorProfile.aggregate([
      {
        // Exclude self
        $match: {
          userId: { $ne: user._id },
        },
      },

      // 4️⃣ Match signals
      {
        $addFields: {
          industryMatchCount: {
            $size: {
              $setIntersection: [
                "$preferredIndustries",
                industryTags,
              ],
            },
          },

          stageMatch: {
            $cond: [
              { $in: [startupStage, "$preferredStages"] },
              1,
              0,
            ],
          },

          geographyMatch: {
            $cond: [
              {
                $and: [
                  { $isArray: "$geographyPreference" },
                  { $ne: [founderCountry, null] },
                  {
                    $in: [
                      founderCountry,
                      "$geographyPreference",
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },

          hasThesis: {
            $cond: [
              { $gt: [{ $strLenCP: "$investmentThesis" }, 50] },
              1,
              0,
            ],
          },
        },
      },

      // 5️⃣ Weighted score
      {
        $addFields: {
          matchScore: {
            $add: [
              { $multiply: ["$industryMatchCount", 3] },
              { $multiply: ["$stageMatch", 3] },
              { $multiply: ["$geographyMatch", 2] },
              { $multiply: ["$hasThesis", 1] },
            ],
          },
        },
      },

      // 6️⃣ Sort
      {
        $sort: {
          matchScore: -1,
          createdAt: -1,
        },
      },

      // 7️⃣ Limit
      { $limit: 20 },

      // 8️⃣ Populate user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // 9️⃣ FINAL PROJECTION (FULL INVESTOR PROFILE)
      {
        $project: {
          _id: 1,
          userId: 1,

          // User info (for cards & routing)
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            avatarUrl: "$user.avatarUrl",
            location: "$user.location",
          },

          // Profile image
          profileImage: 1,

          // Core investor data
          investorType: 1,
          investmentThesis: 1,
          checkSizeMin: 1,
          checkSizeMax: 1,

          preferredStages: 1,
          preferredIndustries: 1,
          geographyPreference: 1,

          // History & links
          pastInvestments: 1,
          links: 1,
          location: 1,

          // Recommendation metadata
          matchScore: 1,
          createdAt: 1,
        },
      },
    ]);

    // 🔁 Fallback (recent investors)
    if (!investors.length) {
      const fallback = await InvestorProfile.find({
        userId: { $ne: user._id },
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "fullName avatarUrl location")
        .lean();

      return res.status(200).json({
        type: "fallback",
        data: fallback,
      });
    }

    return res.status(200).json({
      type: "matched",
      data: investors,
    });
  } catch (error) {
    console.error("Investor recommendation error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
