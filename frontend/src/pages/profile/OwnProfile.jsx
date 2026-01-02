import React from "react";
import { useSelector } from "react-redux";
import { MdAccountCircle, MdWork, MdTrendingUp } from "react-icons/md";
import { FaGithub, FaTwitter, FaGlobe } from "react-icons/fa";

const OwnProfile = () => {
  const { currentAuthUser, authUserLoading } = useSelector(
    (state) => state.user
  );

  if (authUserLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Loading profile…</p>
      </div>
    );
  }

  if (!currentAuthUser || !currentAuthUser.profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Profile not found</p>
      </div>
    );
  }

  const { activeRole, profile, user } = currentAuthUser;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-10 pb-20 lg:pb-2">
        {/* ================= HEADER ================= */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {profile.profileImage?.url || user.avatarUrl ? (
              <img
                src={profile.profileImage?.url || user.avatarUrl}
                alt={user.fullName}
                className="w-36 h-36 rounded-full object-cover border-4 border-border"
              />
            ) : (
              <MdAccountCircle className="w-36 h-36 text-text-muted" />
            )}

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-text-primary">
                {user.fullName}
              </h1>

              <p className="text-lg text-text-secondary mt-2 capitalize">
                {activeRole === "founder" ? "Founder" : "Investor"}
              </p>

              {profile.location?.country && (
                <p className="text-text-muted mt-1">
                  {profile.location.city
                    ? `${profile.location.city}, `
                    : ""}
                  {profile.location.country}
                </p>
              )}

              {/* Links */}
              <div className="flex justify-center md:justify-start gap-4 mt-4">
                {profile.links?.github && (
                  <a
                    href={profile.links.github}
                    target="_blank"
                    className="text-text-muted hover:text-accent"
                  >
                    <FaGithub size={22} />
                  </a>
                )}
                {profile.links?.twitter && (
                  <a
                    href={profile.links.twitter}
                    target="_blank"
                    className="text-text-muted hover:text-accent"
                  >
                    <FaTwitter size={22} />
                  </a>
                )}
                {profile.links?.website && (
                  <a
                    href={profile.links.website}
                    target="_blank"
                    className="text-text-muted hover:text-accent"
                  >
                    <FaGlobe size={22} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= ROLE BASED CONTENT ================= */}
        {activeRole === "founder" ? (
          /* ================= FOUNDER ================= */
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <MdWork className="text-accent" />
              Founder Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Startup Stage" value={profile.startupStage} />
              <Info label="Commitment" value={profile.commitmentLevel} />
              <Info label="Experience" value={`${profile.yearsExperience} yrs`} />
              <Info label="Team Size" value={profile.teamSize} />
              <Info label="Funding" value={profile.fundingStatus} />
            </div>

            {profile.skills?.length > 0 && (
              <TagBlock title="Skills" items={profile.skills} />
            )}

            {profile.interests?.length > 0 && (
              <TagBlock title="Interests" items={profile.interests} />
            )}

            {profile.industryTags?.length > 0 && (
              <TagBlock title="Industries" items={profile.industryTags} />
            )}

            {profile.startupDescription && (
              <p className="mt-6 text-text-secondary italic">
                “{profile.startupDescription}”
              </p>
            )}
          </div>
        ) : (
          /* ================= INVESTOR ================= */
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <MdTrendingUp className="text-accent" />
              Investor Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Investor Type" value={profile.investorType} />
              <Info
                label="Check Size"
                value={`$${profile.checkSizeMin?.toLocaleString()} – $${profile.checkSizeMax?.toLocaleString()}`}
              />
            </div>

            {profile.preferredStages?.length > 0 && (
              <TagBlock
                title="Preferred Stages"
                items={profile.preferredStages}
              />
            )}

            {profile.preferredIndustries?.length > 0 && (
              <TagBlock
                title="Industries"
                items={profile.preferredIndustries}
              />
            )}

            {profile.geographyPreference?.length > 0 && (
              <TagBlock
                title="Geography"
                items={profile.geographyPreference}
              />
            )}

            {profile.investmentThesis && (
              <p className="mt-6 text-text-secondary italic">
                “{profile.investmentThesis}”
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= SMALL REUSABLE BLOCKS ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-text-muted">{label}</p>
    <p className="font-semibold text-text-primary capitalize">
      {value || "—"}
    </p>
  </div>
);

const TagBlock = ({ title, items }) => (
  <div className="mt-6">
    <p className="text-sm text-text-muted mb-2">{title}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default OwnProfile;