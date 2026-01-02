import InvestorProfile from "../models/investorProfie.model.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
import deleteFromCloudinary from "../helpers/deleteFromCloudinary.js";

export const createInvestorProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    // 1️⃣ Find user
    const user = await User.findOne({ clerkId }).select("_id role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Prevent duplicate investor profile
    const existingProfile = await InvestorProfile.findOne({
      userId: user._id,
    }).lean();

    if (existingProfile) {
      return res.status(409).json({
        message: "Investor profile already exists. Use update instead.",
      });
    }

    // 3️⃣ Handle profile image (optional)
    let profileImage = { url: "", publicId: "" };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, {
        folder: "investors/profile-images",
      });

      profileImage = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    // 4️⃣ Explicitly extract allowed fields
    const {
      location,
      investorType,
      investmentThesis,
      checkSizeMin,
      checkSizeMax,
      preferredStages,
      preferredIndustries,
      geographyPreference,
      pastInvestments,
      links,
    } = req.body;

    // 5️⃣ Create investor profile
    const profile = await InvestorProfile.create({
      userId: user._id,
      profileImage,
      location,
      investorType,
      investmentThesis,
      checkSizeMin,
      checkSizeMax,
      preferredStages,
      preferredIndustries,
      geographyPreference,
      pastInvestments,
      links,
    });

    // 6️⃣ Update user role → investor
    await User.findByIdAndUpdate(user._id, {
      role: "investor",
    });

    return res.status(201).json(profile);
  } catch (error) {
    console.error("Create investor profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * UPDATE INVESTOR PROFILE
 * ----------------------------------------
 */
export const updateInvestorProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    /* 1️⃣ Find user */
    const user = await User.findOne({ clerkId }).select("_id role").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "investor") {
      return res
        .status(403)
        .json({ message: "Only investors can update profiles" });
    }

    /* 2️⃣ Find existing profile */
    const existingProfile = await InvestorProfile.findOne({
      userId: user._id,
    }).lean();

    if (!existingProfile) {
      return res.status(404).json({ message: "Investor profile not found" });
    }

    /* 3️⃣ Field groups */
    const PRIMITIVE_FIELDS = [
      "bio",
      "firmName",
      "ticketSizeMin",
      "ticketSizeMax",
      "investmentThesis",
    ];

    // 🔥 USER-CONTROLLED ARRAYS → REPLACE
    const ARRAY_FIELDS = [
      "preferredStages",
      "preferredIndustries",
      "geographyPreference",
    ];

    const OBJECT_FIELDS = ["links"];

    const setUpdates = {};

    /* 4️⃣ Primitive fields (overwrite) */
    PRIMITIVE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        setUpdates[field] = req.body[field];
      }
    });

    /* 5️⃣ Array fields (FULL REPLACE → add + remove works) */
    ARRAY_FIELDS.forEach((field) => {
      if (Array.isArray(req.body[field])) {
        setUpdates[field] = req.body[field];
      }
    });

    /* 6️⃣ Object fields (merge safely) */
    OBJECT_FIELDS.forEach((field) => {
      const incoming = req.body[field];
      if (
        incoming &&
        typeof incoming === "object" &&
        Object.keys(incoming).length > 0
      ) {
        setUpdates[field] = {
          ...(existingProfile[field] || {}),
          ...incoming,
        };
      }
    });

    /* 7️⃣ Past investments (intentional replace) */
    if (Array.isArray(req.body.pastInvestments)) {
      setUpdates.pastInvestments = req.body.pastInvestments;
    }

    /* 8️⃣ Profile image */
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, {
        folder: "investors/profile-images",
      });

      if (existingProfile.profileImage?.publicId) {
        await deleteFromCloudinary(existingProfile.profileImage.publicId);
      }

      setUpdates.profileImage = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    /* 9️⃣ Guard: nothing to update */
    if (!Object.keys(setUpdates).length) {
      return res.status(400).json({ message: "No changes detected" });
    }

    /* 🔟 Update document */
    const updatedProfile = await InvestorProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: setUpdates },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Update investor profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * GET INVESTOR PROFILE BY USER ID (PUBLIC)
 * ----------------------------------------
 */
export const getInvestorProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await InvestorProfile.findOne({ userId })
      .populate("userId", "fullName avatarUrl location")
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Investor profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Get investor by userId error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ----------------------------------------
 * SEARCH INVESTORS
 * ----------------------------------------
 */
export const searchInvestors = async (req, res) => {
  try {
    const clerkId = req.auth.userId; // from Clerk middleware

    // 1️⃣ Find current logged-in user
    const currentUser = await User.findOne({ clerkId }).select("_id");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { investorType, preferredStages, preferredIndustries, geography } =
      req.query;

    // 2️⃣ Base query: EXCLUDE own profile
    const query = {
      userId: { $ne: currentUser._id },
    };

    if (investorType) {
      query.investorType = investorType;
    }

    if (preferredStages) {
      query.preferredStages = {
        $in: preferredStages.split(","),
      };
    }

    if (preferredIndustries) {
      query.preferredIndustries = {
        $in: preferredIndustries.split(",").map((i) => i.trim().toLowerCase()),
      };
    }

    if (geography) {
      query.geographyPreference = {
        $in: geography.split(",").map((g) => g.trim()),
      };
    }

    // 3️⃣ Fetch investors except self
    const investors = await InvestorProfile.find(query)
      .populate("userId", "fullName avatarUrl location")
      .limit(50)
      .lean();

    res.status(200).json(investors);
  } catch (error) {
    console.error("Search investors error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};