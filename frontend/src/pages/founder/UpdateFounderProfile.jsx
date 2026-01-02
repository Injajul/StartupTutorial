import React, { useState, useEffect, useRef } from "react";
import { MdCameraAlt, MdDeleteOutline, MdAccountCircle } from "react-icons/md";

import ChipInput from "../../components/user/ChipInput";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import { updateFounderProfile } from "../../redux/slices/founderSlice";
import { toast } from "react-toastify";

/* ---------------- Helper Functions ---------------- */
const commaStringToArray = (val) =>
  typeof val === "string"
    ? val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

const arrayToCommaString = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");

const toNumber = (val) =>
  val !== undefined && val !== null && val !== "" ? Number(val) : undefined;



/* ---------------- Main Component ---------------- */
const UpdateFounderProfile = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();

  // Get current user from user slice (contains profile)
  const { currentAuthUser, authUserLoading, loading } = useSelector(
    (state) => state.user
  );

  const profile = currentAuthUser?.profile; // Founder profile data

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    commitmentLevel: "full-time",
    skills: "",
    interests: "",
    industryTags: "",
    startupStage: "",
    yearsExperience: "",
    fundingStatus: "",
    teamSize: "",
    lookingForCofounder: false,
    preferredCofounderSkills: "",
    preferredCofounderExperience: "",
    startupDescription: "",
    equityOfferedMin: "",
    equityOfferedMax: "",
    equityNegotiable: true,
    linkedin: "",
    twitter: "",
    github: "",
    website: "",
    profileImageFile: null,
    profileImagePreview: null,
  });

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        commitmentLevel: profile.commitmentLevel || "full-time",
        skills: arrayToCommaString(profile.skills),
        interests: arrayToCommaString(profile.interests),
        industryTags: arrayToCommaString(profile.industryTags),
        startupStage: profile.startupStage || "",
        yearsExperience: profile.yearsExperience ?? "",
        fundingStatus: profile.fundingStatus || "",
        teamSize: profile.teamSize ?? "",
        lookingForCofounder: profile.lookingForCofounder || false,
        preferredCofounderSkills: arrayToCommaString(
          profile.preferredCofounderSkills
        ),
        preferredCofounderExperience:
          profile.preferredCofounderExperience ?? "",
        startupDescription: profile.startupDescription || "",
        equityOfferedMin: profile.equityOffered?.min ?? "",
        equityOfferedMax: profile.equityOffered?.max ?? "",
        equityNegotiable: profile.equityOffered?.negotiable ?? true,
        linkedin: profile.links?.linkedin || "",
        twitter: profile.links?.twitter || "",
        github: profile.links?.github || "",
        website: profile.links?.website || "",
        profileImageFile: null,
        profileImagePreview:
          profile.profileImage?.url || clerkUser?.imageUrl || null,
      });
    }
  }, [profile, clerkUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChipChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        profileImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImageFile: null,
      profileImagePreview: clerkUser?.imageUrl || null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      if (!token) return toast.error("Authentication failed");

      const payload = new FormData();

      payload.append("commitmentLevel", formData.commitmentLevel);

      // Arrays → send as indexed fields
      commaStringToArray(formData.skills).forEach((skill, i) =>
        payload.append(`skills[${i}]`, skill)
      );
      commaStringToArray(formData.interests).forEach((interest, i) =>
        payload.append(`interests[${i}]`, interest)
      );
      commaStringToArray(formData.industryTags).forEach((tag, i) =>
        payload.append(`industryTags[${i}]`, tag)
      );

      payload.append("startupStage", formData.startupStage);
      if (formData.yearsExperience)
        payload.append("yearsExperience", toNumber(formData.yearsExperience));
      payload.append("fundingStatus", formData.fundingStatus);
      if (formData.teamSize)
        payload.append("teamSize", toNumber(formData.teamSize));
      payload.append("lookingForCofounder", formData.lookingForCofounder);

      if (formData.lookingForCofounder) {
        commaStringToArray(formData.preferredCofounderSkills).forEach(
          (skill, i) => payload.append(`preferredCofounderSkills[${i}]`, skill)
        );
        if (formData.preferredCofounderExperience)
          payload.append(
            "preferredCofounderExperience",
            toNumber(formData.preferredCofounderExperience)
          );
      }

      payload.append(
        "startupDescription",
        formData.startupDescription?.trim() || ""
      );

      // Equity Offered
      if (formData.equityOfferedMin || formData.equityOfferedMax) {
        payload.append(
          "equityOffered[min]",
          toNumber(formData.equityOfferedMin) || 0
        );
        payload.append(
          "equityOffered[max]",
          toNumber(formData.equityOfferedMax) || 0
        );
        payload.append("equityOffered[negotiable]", formData.equityNegotiable);
      }

      // Links
      if (formData.linkedin?.trim())
        payload.append("links[linkedin]", formData.linkedin.trim());
      if (formData.twitter?.trim())
        payload.append("links[twitter]", formData.twitter.trim());
      if (formData.github?.trim())
        payload.append("links[github]", formData.github.trim());
      if (formData.website?.trim())
        payload.append("links[website]", formData.website.trim());

      // Image
      if (formData.profileImageFile)
        payload.append("profileImage", formData.profileImageFile);

      await dispatch(updateFounderProfile({ data: payload, token })).unwrap();

      toast.success("Founder profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to update profile");
    }
  };

  // Loading state
  if (authUserLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-4 text-center">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-10">
          <p className="text-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentAuthUser || !profile) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-4 text-center">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-10">
          <p className="text-text-muted">No founder profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="relative">
            {formData.profileImagePreview ? (
              <img
                src={formData.profileImagePreview}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-border shadow-lg"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-surface border-4 border-border shadow-lg flex items-center justify-center">
                <MdAccountCircle className="w-32 h-32 text-text-muted" />
              </div>
            )}

            <label
              htmlFor="profile-image-upload"
              className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-accent-hover transition flex items-center justify-center"
            >
              <MdCameraAlt className="w-5 h-5" />
            </label>

            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {formData.profileImageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1.5 text-xs shadow-lg hover:bg-red-700"
                title="Remove image"
              >
                <MdDeleteOutline className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Update Founder Profile
            </h2>
            <p className="text-text-muted mt-2">
              Keep your profile current so the right co-founders can find you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Commitment Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Commitment Level
            </label>
            <select
              name="commitmentLevel"
              value={formData.commitmentLevel}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="weekends-only">Weekends only</option>
              <option value="advisor">Advisor</option>
            </select>
          </div>

          {/* Skills, Interests, Industry Tags */}
          <ChipInput
            label="Your Skills"
            value={formData.skills}
            onChange={(v) => handleChipChange("skills", v)}
            placeholder="e.g. React, Node.js, Python"
          />
          <ChipInput
            label="Interests / Domains"
            value={formData.interests}
            onChange={(v) => handleChipChange("interests", v)}
            placeholder="e.g. AI, Blockchain, Sustainability"
          />
          <ChipInput
            label="Industry Tags"
            value={formData.industryTags}
            onChange={(v) => handleChipChange("industryTags", v)}
            placeholder="e.g. Fintech, Healthtech, Consumer"
          />

          {/* Startup Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Startup Stage
              </label>
              <select
                name="startupStage"
                value={formData.startupStage}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Not started yet</option>
                <option value="idea">Idea</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="scale">Scaling</option>
                <option value="mature">Mature</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Funding Status
              </label>
              <select
                name="fundingStatus"
                value={formData.fundingStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">None</option>
                <option value="bootstrapped">Bootstrapped</option>
                <option value="friends-family">Friends & Family</option>
                <option value="angel">Angel</option>
                <option value="vc">VC Funded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <NumberInput
              label="Years of Experience"
              name="yearsExperience"
              min="0"
              placeholder="e.g. 5"
              value={formData.yearsExperience}
              onChange={handleChange}
            />
            <NumberInput
              label="Current Team Size"
              name="teamSize"
              min="1"
              placeholder="e.g. 3"
              value={formData.teamSize}
              onChange={handleChange}
            />
          </div>

          {/* Equity Offered */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">
              Equity Offered to Co-founder
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <NumberInput
                label="Min Equity (%)"
                name="equityOfferedMin"
                min="0"
                max="100"
                placeholder="e.g. 10"
                value={formData.equityOfferedMin}
                onChange={handleChange}
              />
              <NumberInput
                label="Max Equity (%)"
                name="equityOfferedMax"
                min="0"
                max="100"
                placeholder="e.g. 30"
                value={formData.equityOfferedMax}
                onChange={handleChange}
              />
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="equityNegotiable"
                    checked={formData.equityNegotiable}
                    onChange={handleChange}
                    className="h-5 w-5 text-accent rounded focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Negotiable
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Startup Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Startup Description
            </label>
            <textarea
              name="startupDescription"
              rows={6}
              maxLength={2000}
              placeholder="Describe your startup idea, problem solved, progress, and vision..."
              value={formData.startupDescription}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-text-muted mt-1 text-right">
              {formData.startupDescription.length}/2000
            </p>
          </div>

          {/* Looking for Co-founder */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="lookingForCofounder"
              checked={formData.lookingForCofounder}
              onChange={handleChange}
              className="h-6 w-6 text-accent rounded focus:ring-accent"
            />
            <label className="text-lg font-medium text-text-primary cursor-pointer">
              I’m looking for a co-founder
            </label>
          </div>

          {formData.lookingForCofounder && (
            <div className="pl-0 sm:pl-10 space-y-6 bg-accent/5 rounded-xl p-6 -mx-6 border border-accent/20">
              <ChipInput
                label="Preferred Co-founder Skills"
                value={formData.preferredCofounderSkills}
                onChange={(v) =>
                  handleChipChange("preferredCofounderSkills", v)
                }
                placeholder="e.g. Marketing, Go, DevOps, Sales"
              />
              <NumberInput
                label="Preferred Experience (years)"
                name="preferredCofounderExperience"
                min="0"
                placeholder="e.g. 3"
                value={formData.preferredCofounderExperience}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Links */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">
              Links (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="url"
                name="twitter"
                placeholder="Twitter / X URL"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="url"
                name="github"
                placeholder="GitHub URL"
                value={formData.github}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="url"
                name="website"
                placeholder="Personal / Startup Website"
                value={formData.website}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent text-white font-semibold py-4 text-lg disabled:opacity-60 transition-all hover:bg-accent-hover"
          >
            {loading ? "Updating Profile..." : "Update Founder Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------------- NumberInput Component ---------------- */
const NumberInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-3">
      {label}
    </label>
    <input
      type="number"
      {...props}
      onWheel={(e) => e.target.blur()}
      className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
    />
  </div>
);

export default UpdateFounderProfile;