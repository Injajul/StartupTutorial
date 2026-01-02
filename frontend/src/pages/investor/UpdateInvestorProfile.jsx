import React, { useState, useEffect } from "react";
import {
  MdDeleteOutline,
  MdCameraAlt,
  MdAddCircleOutline,
  MdAccountCircle,
} from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import { updateInvestorProfile } from "../../redux/slices/investorSlice"; // assuming this exists
import { toast } from "react-toastify";
import ChipInput from "../../components/user/ChipInput";

const STAGE_OPTIONS = [
  "idea",
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "growth",
];

const STAGE_LABELS = {
  idea: "Idea",
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  growth: "Growth / Late Stage",
};

const UpdateInvestorProfile = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  const { currentAuthUser, authUserLoading, loading } = useSelector(
    (state) => state.user // your user slice
  );

  const profile = currentAuthUser?.profile; // <-- this is your prefilled data

  const [formData, setFormData] = useState({
    location: { country: "", city: "" },
    investorType: "",
    investmentThesis: "",
    checkSizeMin: "",
    checkSizeMax: "",
    preferredStages: [],
    preferredIndustries: "",
    geographyPreference: "",
    pastInvestments: [{ company: "", industry: "", amount: "", year: "" }],
    linkedin: "",
    twitter: "",
    website: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Pre-fill form when currentAuthUser.profile is available
  useEffect(() => {
    if (profile) {
      setFormData({
        location: {
          country: profile.location?.country || "",
          city: profile.location?.city || "",
        },
        investorType: profile.investorType || "",
        investmentThesis: profile.investmentThesis || "",
        checkSizeMin: profile.checkSizeMin || "",
        checkSizeMax: profile.checkSizeMax || "",
        preferredStages: profile.preferredStages || [],
        preferredIndustries: profile.preferredIndustries?.join(", ") || "",
        geographyPreference: profile.geographyPreference?.join(", ") || "",
        pastInvestments:
          profile.pastInvestments?.length > 0
            ? profile.pastInvestments.map((inv) => ({
                company: inv.company || "",
                industry: inv.industry || "",
                amount: inv.amount || "",
                year: inv.year || "",
              }))
            : [{ company: "", industry: "", amount: "", year: "" }],
        linkedin: profile.links?.linkedin || "",
        twitter: profile.links?.twitter || "",
        website: profile.links?.website || "",
      });

      setProfileImagePreview(
        profile.profileImage?.url || clerkUser?.imageUrl || null
      );
    }
  }, [profile, clerkUser]);

  // Handlers (same as before)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleChipChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStageToggle = (stage) => {
    setFormData((prev) => {
      const current = prev.preferredStages;
      if (current.includes(stage)) {
        return { ...prev, preferredStages: current.filter((s) => s !== stage) };
      } else {
        return { ...prev, preferredStages: [...current, stage] };
      }
    });
  };

  const handlePastInvestmentChange = (index, field, value) => {
    const updated = [...formData.pastInvestments];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, pastInvestments: updated }));
  };

  const addPastInvestment = () => {
    setFormData((prev) => ({
      ...prev,
      pastInvestments: [
        ...prev.pastInvestments,
        { company: "", industry: "", amount: "", year: "" },
      ],
    }));
  };

  const removePastInvestment = (index) => {
    setFormData((prev) => ({
      ...prev,
      pastInvestments: prev.pastInvestments.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      if (!token) return toast.error("Authentication failed");

      const payload = new FormData();

      // ─────────────────────────
      // Profile Image
      // ─────────────────────────
      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      // ─────────────────────────
      // Primitive Fields
      // ─────────────────────────
      payload.append("investorType", formData.investorType);

      if (formData.investmentThesis?.trim()) {
        payload.append("investmentThesis", formData.investmentThesis.trim());
      }

      if (formData.checkSizeMin) {
        payload.append("checkSizeMin", Number(formData.checkSizeMin));
      }

      if (formData.checkSizeMax) {
        payload.append("checkSizeMax", Number(formData.checkSizeMax));
      }

      // ─────────────────────────
      // Location (object)
      // ─────────────────────────
      if (formData.location.country?.trim()) {
        payload.append("location[country]", formData.location.country.trim());
      }

      if (formData.location.city?.trim()) {
        payload.append("location[city]", formData.location.city.trim());
      }

      // ─────────────────────────
      // Preferred Stages (INDEXED ARRAY ✅)
      // ─────────────────────────
      formData.preferredStages.forEach((stage, index) => {
        payload.append(`preferredStages[${index}]`, stage);
      });

      // ─────────────────────────
      // Preferred Industries (INDEXED ARRAY ✅)
      // ─────────────────────────
      formData.preferredIndustries
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean)
        .forEach((industry, index) => {
          payload.append(`preferredIndustries[${index}]`, industry);
        });

      // ─────────────────────────
      // Geography Preference (INDEXED ARRAY ✅)
      // ─────────────────────────
      formData.geographyPreference
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
        .forEach((geo, index) => {
          payload.append(`geographyPreference[${index}]`, geo);
        });

      // ─────────────────────────
      // Past Investments 
      // ─────────────────────────
      const cleanInvestments = formData.pastInvestments
        .filter((inv) => inv.company?.trim())
        .map((inv) => ({
          company: inv.company.trim(),
          industry: inv.industry?.trim() || undefined,
          amount: inv.amount ? Number(inv.amount) : undefined,
          year: inv.year ? Number(inv.year) : undefined,
        }));

      cleanInvestments.forEach((inv, index) => {
        payload.append(`pastInvestments[${index}][company]`, inv.company);

        if (inv.industry) {
          payload.append(`pastInvestments[${index}][industry]`, inv.industry);
        }

        if (inv.amount !== undefined) {
          payload.append(`pastInvestments[${index}][amount]`, inv.amount);
        }

        if (inv.year !== undefined) {
          payload.append(`pastInvestments[${index}][year]`, inv.year);
        }
      });

      // ─────────────────────────
      // Links (object – indexed keys)
      // ─────────────────────────
      if (formData.linkedin?.trim()) {
        payload.append("links[linkedin]", formData.linkedin.trim());
      }

      if (formData.twitter?.trim()) {
        payload.append("links[twitter]", formData.twitter.trim());
      }

      if (formData.website?.trim()) {
        payload.append("links[website]", formData.website.trim());
      }

      // ─────────────────────────
      // Dispatch
      // ─────────────────────────
      await dispatch(updateInvestorProfile({ data: payload, token })).unwrap();

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update investor profile error:", err);
      toast.error(err?.message || "Failed to update profile");
    }
  };

  // Loading state
  if (authUserLoading || loading) {
    return (
      <div className="text-center py-20 text-text-muted">
        Loading your profile...
      </div>
    );
  }

  // If no currentAuthUser or no profile (shouldn't happen on Update page)
  if (!currentAuthUser || !profile) {
    return (
      <div className="text-center py-20 text-text-muted">
        No investor profile found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 pb-20 sm:mt-12 px-4 sm:px-6 lg:px-8 lg:pb-0">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-border shadow-lg"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-surface border-4 border-border shadow-lg flex items-center justify-center">
                <MdAccountCircle className="w-32 h-32 text-text-muted" />
              </div>
            )}

            <label
              htmlFor="update-investor-image"
              className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-accent-hover transition flex items-center justify-center"
            >
              <MdCameraAlt className="w-5 h-5" />
            </label>

            <input
              id="update-investor-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-text-primary">
              Update Investor Profile
            </h1>
            <p className="text-text-muted mt-2">
              Keep your investment focus up to date.
            </p>
          </div>
        </div>

        {/* Rest of the form – exactly same as before */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* NEW: Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="e.g. United States"
                value={formData.location.country}
                onChange={handleLocationChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                City (optional)
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. San Francisco"
                value={formData.location.city}
                onChange={handleLocationChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Investor Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Investor Type
            </label>
            <select
              name="investorType"
              value={formData.investorType}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select type</option>
              <option value="angel">Angel Investor</option>
              <option value="vc">Venture Capital</option>
              <option value="syndicate">Syndicate</option>
              <option value="corporate">Corporate VC</option>
              <option value="accelerator">Accelerator</option>
              <option value="family-office">Family Office</option>
            </select>
          </div>

          {/* Check Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <NumberInput
              label="Min Check Size ($)"
              name="checkSizeMin"
              min="0"
              placeholder="e.g. 25000"
              value={formData.checkSizeMin}
              onChange={handleChange}
            />
            <NumberInput
              label="Max Check Size ($)"
              name="checkSizeMax"
              min="0"
              placeholder="e.g. 500000"
              value={formData.checkSizeMax}
              onChange={handleChange}
            />
          </div>

          {/* Preferred Stages – Now Multi-Select Buttons */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Preferred Startup Stages
            </label>
            <div className="flex flex-wrap gap-3">
              {STAGE_OPTIONS.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => handleStageToggle(stage)}
                  className={`px-4 py-2 rounded-xl border transition-all ${
                    formData.preferredStages.includes(stage)
                      ? "bg-accent text-white border-accent"
                      : "bg-bg border-border text-text-primary hover:bg-surface"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Industries & Geography – Keep ChipInput */}
          <ChipInput
            label="Preferred Industries"
            value={formData.preferredIndustries}
            onChange={(v) => handleChipChange("preferredIndustries", v)}
            placeholder="e.g. AI, Fintech, Healthtech"
          />
          <ChipInput
            label="Geography Preference"
            value={formData.geographyPreference}
            onChange={(v) => handleChipChange("geographyPreference", v)}
            placeholder="e.g. USA, Europe, India"
          />

          {/* Investment Thesis */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Investment Thesis
            </label>
            <textarea
              name="investmentThesis"
              rows={6}
              maxLength={3000}
              placeholder="Describe your investment philosophy, focus areas, and what excites you..."
              value={formData.investmentThesis}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-text-muted mt-1 text-right">
              {formData.investmentThesis.length}/3000
            </p>
          </div>

          {/* Past Investments */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-text-primary">
                Notable Past Investments
              </label>
              <button
                type="button"
                onClick={addPastInvestment}
                className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors font-medium text-sm"
              >
                <MdAddCircleOutline className="w-5 h-5" />
                Add Investment
              </button>
            </div>
            {formData.pastInvestments.map((inv, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 p-4 bg-surface rounded-xl border border-border"
              >
                <input
                  placeholder="Company"
                  value={inv.company}
                  onChange={(e) =>
                    handlePastInvestmentChange(i, "company", e.target.value)
                  }
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary"
                />
                <input
                  placeholder="Industry"
                  value={inv.industry}
                  onChange={(e) =>
                    handlePastInvestmentChange(i, "industry", e.target.value)
                  }
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary"
                />
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={inv.amount}
                  onChange={(e) =>
                    handlePastInvestmentChange(i, "amount", e.target.value)
                  }
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-text-primary"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Year"
                    min="1900"
                    max="2030"
                    value={inv.year}
                    onChange={(e) =>
                      handlePastInvestmentChange(i, "year", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-text-primary"
                  />
                  {formData.pastInvestments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePastInvestment(i)}
                      className="text-error hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Remove investment"
                    >
                      <MdDeleteOutline className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="url"
              name="twitter"
              placeholder="Twitter / X URL"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="url"
              name="website"
              placeholder="Personal / Firm Website"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent text-white font-semibold py-2 sm:py-4 text-lg disabled:opacity-60 transition-all hover:bg-accent-hover"
          >
            {loading ? "Updating Profile..." : "Update Investor Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

const NumberInput = ({ label, placeholder, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">
      {label}
    </label>
    <input
      type="number"
      placeholder={placeholder}
      {...props}
      onWheel={(e) => e.target.blur()}
      className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent placeholder-text-muted"
    />
  </div>
);

export default UpdateInvestorProfile;