import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMatchRequest } from "../../redux/slices/matchRequestSlice";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaCheck } from "react-icons/fa";

const SentMatchRequest = ({ targetUserId }) => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const [isSending, setIsSending] = useState(false);

  const { sent } = useSelector((state) => state.matchRequest);
  console.log("sent", sent);
  const { currentAuthUser } = useSelector((state) => state.user);

  const hasSentRequest = sent.some((req) => {
    if (!req?.to) return false;

    const toId =
      typeof req.to === "object" ? req.to._id?.toString() : req.to?.toString();

    return toId === targetUserId?.toString();
  });

  console.log("hasSentRequest", hasSentRequest);
  // 🔒 Prevent self-request
  if (!currentAuthUser || currentAuthUser._id === targetUserId) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-surface text-text-muted opacity-60 cursor-not-allowed"
      >
        This is you
      </button>
    );
  }

  const handleSend = async () => {
    if (isSending || hasSentRequest) return;

    try {
      setIsSending(true);
      const token = await getToken();

      await dispatch(
        sendMatchRequest({
          data: { toUserId: targetUserId },
          token,
        })
      ).unwrap();

      toast.success("Match request sent");
    } catch (err) {
      toast.error(err?.message || "Failed to send request");
    } finally {
      setIsSending(false);
    }
  };

  // ✅ INSTAGRAM-LIKE STATE
  if (hasSentRequest) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-success/15 text-success font-semibold cursor-default flex items-center justify-center gap-2"
      >
        <FaCheck />
        Request Sent
      </button>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={isSending}
      className={`w-full py-3 rounded-xl font-bold transition-all ${
        isSending
          ? "bg-accent/70 text-white cursor-not-allowed"
          : "bg-accent text-white hover:scale-105"
      }`}
    >
      <FaPaperPlane className="inline mr-2" />
      {isSending ? "Sending..." : "Send Match Request"}
    </button>
  );
};

export default SentMatchRequest;