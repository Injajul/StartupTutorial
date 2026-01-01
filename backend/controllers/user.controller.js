import User from "../models/user.model.js"
import FounderProfile from "../models/founderProfile.model.js"
import InvestorProfile from "../models/investorProfie.model.js"
import MatchRequest from "../models/matchRequest.model.js";
import Connection from "../models/connection.model.js";
import ChatRoom from "../models/chatRoom.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import deleteFromCloudinary from "../helpers/deleteFromCloudinary.js";

/**
 * ----------------------------------------
 * CLERK WEBHOOK HANDLER
 * ----------------------------------------
 */
export const handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.event;

    /**
     * ----------------------------------------
     * USER CREATED
     * ----------------------------------------
     */
    if (type === "user.created") {
      const clerkId = data.id;

      const exists = await User.findOne({ clerkId });
      if (exists) {
        return res.status(200).json({ message: "User already exists" });
      }

      const newUser = new User({
        clerkId,
        fullName: data.first_name
          ? `${data.first_name} ${data.last_name || ""}`.trim()
          : "Anonymous",
        email: data.email_addresses?.[0]?.email_address || "",
        avatarUrl: data.image_url || "",
        role: "founder", // default role (can be changed in onboarding)
      });

      await newUser.save();
    } else if (type === "user.updated") {

    /**
     * ----------------------------------------
     * USER UPDATED
     * ----------------------------------------
     */
      const clerkId = data.id;

      const updates = {};

      if (data.first_name) {
        updates.fullName = `${data.first_name} ${data.last_name || ""}`.trim();
      }

      if (data.email_addresses?.[0]?.email_address) {
        updates.email = data.email_addresses[0].email_address;
      }

      if (data.image_url) {
        updates.avatarUrl = data.image_url;
      }

      updates.lastActiveAt = new Date();

      await User.findOneAndUpdate({ clerkId }, updates, { new: true });
    } else if (type === "user.deleted") {

    /**
     * ----------------------------------------
     * USER DELETED (FULL CLEANUP)
     * ----------------------------------------
     */
      const clerkId = data.id;

      // 1️⃣ Find user
      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(200).json({ message: "User already deleted" });
      }

      const userId = user._id;

      /**
       * ----------------------------------------
       * DELETE USER AVATAR IMAGE
       * ----------------------------------------
       */
      if (user.avatarUrl) {
        try {
          await deleteFromCloudinary(user.avatarUrl);
        } catch (err) {
          console.error("Avatar deletion failed:", err.message);
        }
      }

      /**
       * ----------------------------------------
       * DELETE PROFILES
       * ----------------------------------------
       */
      await Promise.all([
        FounderProfile.deleteOne({ userId }),
        InvestorProfile.deleteOne({ userId }),
      ]);

      /**
       * ----------------------------------------
       * DELETE MATCH REQUESTS
       * ----------------------------------------
       */
      await MatchRequest.deleteMany({
        $or: [{ from: userId }, { to: userId }],
      });

      /**
       * ----------------------------------------
       * DELETE CONNECTIONS
       * ----------------------------------------
       */
      const connections = await Connection.find({
        participants: userId,
      });

      const connectionIds = connections.map((c) => c._id);

      await Connection.deleteMany({
        _id: { $in: connectionIds },
      });

      /**
       * ----------------------------------------
       * DELETE CHAT ROOMS
       * ----------------------------------------
       */
      const chatRooms = await ChatRoom.find({
        participants: userId,
      });

      const chatRoomIds = chatRooms.map((r) => r._id);

      await ChatRoom.deleteMany({
        _id: { $in: chatRoomIds },
      });

      /**
       * ----------------------------------------
       * DELETE MESSAGES
       * ----------------------------------------
       */
      await Message.deleteMany({
        $or: [{ from: userId }, { to: userId }],
      });

      /**
       * ----------------------------------------
       * DELETE NOTIFICATIONS
       * ----------------------------------------
       */
      await Notification.deleteMany({
        $or: [{ userId }, { fromUserId: userId }],
      });

      /**
       * ----------------------------------------
       * FINALLY DELETE USER
       * ----------------------------------------
       */
      await User.deleteOne({ _id: userId });
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getCurrentContext = async (req, res)=>{

    try {
       const clerkId = req.auth.userId
       const user = await User.findOne({clerkId}).lean()

       if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
       }

       let profile =null

       if (user.role ==="founder"){
        profile = await FounderProfile.findOne({
            userId:user._id
        }).lean()
       } else if (user.role ==="investor"){
        profile = await InvestorProfile.findOne({
            userId: user._id,
        }).lean()
       }

       return res.status(200).json({
        user:{
            _id:user._id,
            clerkId:user.clerkId,
            fullName:user.fullName,
            email:user.email,
            avatartUrl: user.avatarUrl,
            role:user.role

        },
        activeRole:user.role,
        profile,
       })
    } catch (error) {
        console.error("Get current context error ", error )
        return res.status(500).json({message:"Internal server error "})
    }
}
