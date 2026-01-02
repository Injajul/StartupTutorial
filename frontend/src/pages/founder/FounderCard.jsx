import React from "react";

import { FaBriefcase, FaHandshake, FaUsers, FaSeedling } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import SentMatchRequest from "../../components/user/SentMatchRequest";
import { useNavigate } from "react-router-dom";

const FounderCard = ({ founder }) => {
  const navigate = useNavigate();

  const getUserId = (founder) => {
    if (typeof founder.userId === "object" && founder.userId?._id) {
      return founder.userId._id;
    }
    if (typeof founder.userId === "string") {
      return founder.userId;
    }
    if (founder.user?._id) {
      return founder.user._id;
    }
    return null;
  };

  const founderUserId = getUserId(founder);

  const user =
    typeof founder.userId === "object" ? founder.userId : founder.user || null;

  const goToProfile = () => {
    if (!founderUserId) return;
    navigate(`/founders/${founderUserId}`);
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
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {founder.profileImage?.url || user?.avatarUrl ? (
          <img
            src={founder.profileImage?.url || user?.avatarUrl}
            alt={user?.fullName}
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <MdAccountCircle className="w-20 h-20 text-text-muted" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {founder.lookingForCofounder && (
          <div className="absolute top-3 right-3 bg-accent text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <FaHandshake className="text-xs" />
            Open to CF
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white">{user?.fullName}</h3>
          <p className="text-xs text-white/90 capitalize">
            {founder.startupStage} stage • {founder.commitmentLevel}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-4 flex-1">
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <FaBriefcase /> {founder.yearsExperience}+ yrs
          </div>
          <div className="flex items-center gap-2">
            <FaUsers /> Team size: {founder.teamSize}
          </div>
          <div className="flex items-center gap-2">
            <FaSeedling /> {founder.fundingStatus}
          </div>
        </div>

        {founder.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {founder.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 mt-auto" onClick={(e) => e.stopPropagation()}>
        <SentMatchRequest targetUserId={founderUserId} />
      </div>
    </div>
  );
};

export default FounderCard;