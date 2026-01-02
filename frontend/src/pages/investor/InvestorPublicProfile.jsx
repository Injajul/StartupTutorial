import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvestorProfileByUserId } from "../../redux/slices/investorSlice";
import { FaDollarSign, FaMapMarkedAlt, FaLink, FaBriefcase } from "react-icons/fa";

const InvestorPublicProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { viewedProfile: profile, loading } = useSelector((state) => state.investor);

  useEffect(() => {
    if (userId) dispatch(getInvestorProfileByUserId(userId));
  }, [userId, dispatch]);

  if (loading) {
    return <div className="text-center py-20 text-text-muted">Loading investor profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-error">Investor not found</div>;
  }

  const user = profile.userId;

  return (
    <div className="max-w-5xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Hero */}
        <div className="h-64 bg-gradient-to-br from-accent/20 to-accent/10 relative">
          <img
            src={profile.profileImage?.url || user?.avatarUrl || "/default-avatar.png"}
            alt={user?.fullName}
            className="absolute bottom-0 left-8 translate-y-1/2 h-48 w-48 rounded-full object-cover border-8 border-card shadow-2xl"
          />
        </div>

        <div className="pt-28 px-8 pb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary">{user?.fullName}</h1>
            <p className="text-2xl text-accent capitalize mt-2">{profile.investorType} Investor</p>
            {user?.location && <p className="text-text-muted mt-1">{user.location}</p>}
          </div>

          {/* Check Size */}
          {profile.checkSizeMin && profile.checkSizeMax && (
            <div className="bg-accent/5 border border-accent/30 rounded-2xl p-6 mb-8 text-center">
              <p className="text-sm text-text-muted mb-2">Typical Check Size</p>
              <p className="text-4xl font-bold text-accent">
                ${profile.checkSizeMin.toLocaleString()} – ${profile.checkSizeMax.toLocaleString()}
              </p>
            </div>
          )}

          {/* Thesis */}
          {profile.investmentThesis && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Investment Thesis</h2>
              <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                {profile.investmentThesis}
              </p>
            </div>
          )}

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {profile.preferredStages?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <FaBriefcase className="text-accent" /> Preferred Stages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredStages.map((stage, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-accent/10 text-accent capitalize">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.geographyPreference?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <FaMapMarkedAlt className="text-accent" /> Geography Focus
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.geographyPreference.map((loc, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-accent/10 text-accent">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Past Investments */}
          {profile.pastInvestments?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Notable Investments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.pastInvestments.map((inv, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl p-4">
                    <p className="font-semibold text-text-primary">{inv.company}</p>
                    {inv.industry && <p className="text-sm text-text-muted">{inv.industry}</p>}
                    {inv.amount && <p className="text-sm text-accent">${inv.amount.toLocaleString()}</p>}
                    {inv.year && <p className="text-xs text-text-muted">{inv.year}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {Object.values(profile.links || {}).some(Boolean) && (
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">Connect</h2>
              <div className="flex flex-wrap gap-4">
                {profile.links?.linkedin && (
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <FaLink /> LinkedIn
                  </a>
                )}
                {profile.links?.twitter && (
                  <a href={profile.links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <FaLink /> Twitter / X
                  </a>
                )}
                {profile.links?.website && (
                  <a href={profile.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <FaLink /> Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorPublicProfile;