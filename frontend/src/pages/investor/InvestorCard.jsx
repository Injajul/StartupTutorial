import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
// import SentMatchRequest from "../../components/user/SentMatchRequest";

const InvestorCard = ({ investor }) => {
  const navigate = useNavigate();

  const getInvestorUserId = (investor) => {
    if (!investor) return null;

    if (typeof investor.userId === "object" && investor.userId?._id) {
      return investor.userId._id;
    }

    if (typeof investor.userId === "string") {
      return investor.userId;
    }

    if (investor.user?._id) {
      return investor.user._id;
    }

    return null;
  };

  const investorUserId = getInvestorUserId(investor);

  const user =
    typeof investor.userId === "object"
      ? investor.userId
      : investor.user || null;

  const profile = investor;

  const goToProfile = () => {
    if (!investorUserId) return;
    navigate(`/investors/${investorUserId}`);
  };

  return (
    <div
      onClick={goToProfile}
      className="
        group cursor-pointer
        bg-card border border-border rounded-3xl
        shadow-sm hover:shadow-xl transition-all duration-300
        flex flex-col h-full min-h-[460px]
      "
    >
      {/* ================= THUMBNAIL ================= */}
      <div className="relative aspect-video">
        <img
          src={
            profile.profileImage?.url ||
            user?.avatarUrl ||
            "/default-avatar.png"
          }
          alt={user?.fullName || "Investor"}
          className="w-full h-52 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold leading-tight">
            {user?.fullName || "Investor"}
          </h3>
          <p className="text-xs opacity-90 capitalize">
            {profile.investorType?.replace("-", " ") || "Investor"}
          </p>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="px-6 py-4 flex-1 space-y-4 text-center">
        {profile.checkSizeMin && profile.checkSizeMax && (
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Check Size
            </p>
            <p className="text-2xl font-bold text-accent">
              ${profile.checkSizeMin.toLocaleString()} – $
              {profile.checkSizeMax.toLocaleString()}
            </p>
          </div>
        )}

        {profile.preferredStages?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {profile.preferredStages.slice(0, 3).map((stage) => (
              <span
                key={stage}
                className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium capitalize"
              >
                {stage.replace("-", " ")}
              </span>
            ))}
          </div>
        )}

        {profile.preferredIndustries?.length > 0 && (
          <p className="text-sm text-text-secondary">
            Focus:{" "}
            <span className="font-medium">
              {profile.preferredIndustries.join(" • ")}
            </span>
          </p>
        )}

        {profile.geographyPreference?.length > 0 && (
          <div className="flex justify-center items-center gap-2 text-sm text-text-muted">
            <FaMapMarkedAlt className="text-accent" />
            {profile.geographyPreference.join(" • ")}
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      {/* <div
        className="px-6 pb-6 mt-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <SentMatchRequest targetUserId={investorUserId} />
      </div> */}
    </div>
  );
};

export default InvestorCard;