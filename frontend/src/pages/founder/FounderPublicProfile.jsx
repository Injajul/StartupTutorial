import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFounderByUserId } from "../../redux/slices/founderSlice";

const FounderPublicProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { viewedProfile, loading, error } = useSelector(
    (state) => state.founder
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchFounderByUserId(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-16 px-4 text-center">
        <p className="text-text-muted">Loading founder profile…</p>
      </div>
    );
  }

  if (error || !viewedProfile) {
    return (
      <div className="max-w-5xl mx-auto mt-16 px-4 text-center">
        <p className="text-error font-medium">Founder profile not found</p>
      </div>
    );
  }

  const user = viewedProfile.userId;
  const profile = viewedProfile;

  return (
    <div className="max-w-5xl mx-auto mt-8 pb-20 sm:mt-12 px-4 sm:px-6 lg:px-8 lg:pb-2 ">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* ================= Header ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <img
            src={
              profile.profileImage?.url ||
              user?.avatarUrl ||
              "/default-avatar.png"
            }
            alt={user?.fullName || "Founder"}
            className="h-32 w-32 rounded-full object-cover border-4 border-border shadow-lg"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              {user?.fullName || "Founder"}
            </h1>
            <p className="text-lg text-text-muted capitalize mt-2">
              {profile.commitmentLevel.replace("-", " ")} Founder
            </p>
            {profile.fundingStatus && (
              <p className="text-sm text-accent mt-1">
                Funding:{" "}
                {profile.fundingStatus.replace("-", " & ").replace("vc", "VC")}
              </p>
            )}
          </div>
        </div>

        {/* ================= Skills ================= */}
        {profile.skills?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-accent/10 text-accent font-medium capitalize"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ================= Interests & Industries ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {profile.interests?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Interests
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-accent/10 text-accent capitalize"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.industryTags?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Industries
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.industryTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-accent/10 text-accent capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= Key Stats ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {profile.startupStage && (
            <div className="bg-bg border border-border rounded-xl p-5 text-center">
              <p className="text-sm text-text-muted">Stage</p>
              <p className="text-lg font-bold text-text-primary capitalize mt-1">
                {profile.startupStage.replace("-", " ")}
              </p>
            </div>
          )}
          {profile.yearsExperience !== undefined && (
            <div className="bg-bg border border-border rounded-xl p-5 text-center">
              <p className="text-sm text-text-muted">Experience</p>
              <p className="text-lg font-bold text-text-primary mt-1">
                {profile.yearsExperience} yrs
              </p>
            </div>
          )}
          {profile.teamSize && (
            <div className="bg-bg border border-border rounded-xl p-5 text-center">
              <p className="text-sm text-text-muted">Team Size</p>
              <p className="text-lg font-bold text-text-primary mt-1">
                {profile.teamSize}
              </p>
            </div>
          )}
          {profile.equityOffered && (
            <div className="bg-bg border border-border rounded-xl p-5 text-center">
              <p className="text-sm text-text-muted">Equity Offered</p>
              <p className="text-lg font-bold text-text-primary mt-1">
                {profile.equityOffered.min && profile.equityOffered.max
                  ? `${profile.equityOffered.min}–${profile.equityOffered.max}%`
                  : profile.equityOffered.negotiable
                  ? "Negotiable"
                  : "—"}
              </p>
            </div>
          )}
        </div>

        {/* ================= Startup Description ================= */}
        {profile.startupDescription && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              About the Startup
            </h2>
            <div className="bg-bg border border-border rounded-xl p-6">
              <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                {profile.startupDescription}
              </p>
            </div>
          </div>
        )}

        {/* ================= Links ================= */}
        {Object.values(profile.links || {}).some(Boolean) && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Links
            </h2>
            <div className="flex flex-wrap gap-4">
              {profile.links?.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {profile.links?.twitter && (
                <a
                  href={profile.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Twitter / X
                </a>
              )}
              {profile.links?.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  GitHub
                </a>
              )}
              {profile.links?.website && (
                <a
                  href={profile.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}

        {/* ================= Co-founder Search ================= */}
        {profile.lookingForCofounder && (
          <div className="bg-accent/5 border border-accent/30 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Looking for a Co-founder
            </h2>
            {profile.preferredCofounderSkills?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-text-muted mb-3">Preferred Skills</p>
                <div className="flex flex-wrap gap-3">
                  {profile.preferredCofounderSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-accent/20 text-accent font-medium capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.preferredCofounderExperience !== undefined && (
              <p className="text-text-primary">
                <span className="text-text-muted">Experience:</span>{" "}
                <strong>{profile.preferredCofounderExperience}+ years</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderPublicProfile;