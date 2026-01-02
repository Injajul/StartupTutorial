import FounderProfile from "../models/founderProfile.model.js";
import User from "../models/user.model.js";
import uploadToCloudinary from "../helpers/uploadToCloudinary.js";
import deleteFromCloudinary from "../helpers/deleteFromCloudinary.js";

export const createFounderProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await User.findOne({ clerkId }).select("_id role");

    if (!user) {
      return res.status(404).json({
        success: false,
        messag: "User not found ",
      });
    }

    const existingProfile = await FounderProfile.findOne({
      userId: user._id,
    }).lean();

    if (existingProfile) {
      return res
        .status(409)
        .json({ success: false, message: "Founder profile already exists" });
    }

     // 3️⃣ Handle profile image (optional)
    let profileImage = { url: "", publicId: "" };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, {
        folder: "founders/profile-images",
      });

      profileImage = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    // 4️⃣ Explicitly extract allowed fields
    const {
      location,
      commitmentLevel,
      skills,
      interests,
      industryTags,
      startupStage,
      yearsExperience,
      fundingStatus,
      teamSize,
      lookingForCofounder,
      preferredCofounderSkills,
      preferredCofounderExperience,
      startupDescription,
      equityOffered,
      links,
    } = req.body;

    // 5️⃣ Create founder profile
    const profile = await FounderProfile.create({
      userId: user._id,
      profileImage,
      location,
      commitmentLevel,
      skills,
      interests,
      industryTags,
      startupStage,
      yearsExperience,
      fundingStatus,
      teamSize,
      lookingForCofounder,
      preferredCofounderSkills,
      preferredCofounderExperience,
      startupDescription,
      equityOffered,
      links,
    });

    // 6️⃣ Update user role → founder
    await User.findByIdAndUpdate(user._id, {
      role: "founder",
    });
    return res.status(201).json(profile)
  } catch (error) {
    console.error("Fetch  founderPrfolie error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchAllFounders = async (req, res) => {
  try {
    const founders = await FounderProfile.find()
      .populate("userId", "fullName avatarUrl role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(founders);
  } catch (error) {
    console.error("Fetch all founders error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFounderProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await FounderProfile.findOne({ userId })
      .populate("userId", "fullName avatarUrl location")
      .lean();

    if (!profile) {
      return res.status(404).json({ message: "Founder profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Get founder profile by userId error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateFounderProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    /* 1️⃣ Find user */
    const user = await User.findOne({ clerkId }).select("_id role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "founder") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only founders can update this profile" });
    }

    /* 2️⃣ Find existing profile */
    const existingProfile = await FounderProfile.findOne({
      userId: user._id,
    }).lean();

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    /* 3️⃣ Field definitions */
    const PRIMITIVE_FIELDS = [
      "commitmentLevel",
      "startupStage",
      "yearsExperience",
      "teamSize",
      "fundingStatus",
      "lookingForCofounder",
      "preferredCofounderExperience",
      "startupDescription",
    ];

    // 🔥 IMPORTANT: these arrays are USER-CONTROLLED → REPLACE, not append
    const ARRAY_FIELDS = [
      "skills",
      "interests",
      "industryTags",
      "preferredCofounderSkills",
    ];

    const OBJECT_FIELDS = ["links", "equityOffered"];

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

    /* 7️⃣ Handle profile image */
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, {
        folder: "founders/profile-images",
      });

      if (existingProfile.profileImage?.publicId) {
        await deleteFromCloudinary(
          existingProfile.profileImage.publicId
        ).catch(console.warn);
      }

      setUpdates.profileImage = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    /* 8️⃣ Guard: nothing to update */
    if (!Object.keys(setUpdates).length) {
      return res.status(400).json({ message: "No changes detected" });
    }

    /* 9️⃣ Update document */
    const updatedProfile = await FounderProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: setUpdates },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Update founder profile error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const searchFounders = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    // 1️⃣ Find current logged-in user
    const currentUser = await User.findOne({ clerkId }).select("_id");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      skills,
      interests,
      industryTags,
      startupStage,
      commitmentLevel,
      lookingForCofounder,
    } = req.query;

    // 2️⃣ Base query: exclude own profile
    const query = {
      userId: { $ne: currentUser._id },
    };

    if (skills) {
      query.skills = {
        $in: skills.split(",").map((s) => s.trim().toLowerCase()),
      };
    }

    if (interests) {
      query.interests = {
        $in: interests.split(",").map((s) => s.trim().toLowerCase()),
      };
    }

    if (industryTags) {
      query.industryTags = {
        $in: industryTags.split(",").map((t) => t.trim().toLowerCase()),
      };
    }

    if (startupStage) {
      query.startupStage = startupStage;
    }

    if (commitmentLevel) {
      query.commitmentLevel = commitmentLevel;
    }

    if (lookingForCofounder !== undefined) {
      query.lookingForCofounder = lookingForCofounder === "true";
    }

    // 3️⃣ Fetch founders except self
    const founders = await FounderProfile.find(query)
      .populate("userId", "fullName avatarUrl location")
      .limit(20)
      .lean();

    return res.status(200).json(founders);
  } catch (error) {
    console.error("Search founders error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};