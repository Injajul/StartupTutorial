import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCameraAlt, MdDeleteOutline, MdAccountCircle } from "react-icons/md";
import { useAuth, useUser } from "@clerk/clerk-react";
import { createFounderProfile } from "../../redux/slices/founderSlice";
import { toast } from "react-toastify";
import ChipInput from "../../components/user/ChipInput";
/* ---------------- Helper Functions ---------------- */
const toArray = (str) =>
  str
    ? str
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

const toNumber = (val) =>
  val !== "" && val !== null && val !== undefined ? Number(val) : undefined;

/* ---------------- Main Component ---------------- */
const CreateFounderProfile = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { loading } = useSelector((state) => state.founder);

  const INITIAL_FORM_STATE = {
    commitmentLevel: "full-time",
    skills: "",
    interests: "",
    industryTags: "",
    startupStage: "",
    yearsExperience: "",
    teamSize: "",
    fundingStatus: "",
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
  };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    user?.imageUrl || "/default-avatar.png"
  );

  /* ---------------- Handlers ---------------- */
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
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(user?.imageUrl || "/default-avatar.png");
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed. Please try again.");
        return;
      }

      const payload = new FormData();

      // Profile Image (optional)
      if (profileImageFile) {
        payload.append("profileImage", profileImageFile);
      }

      // Primitive fields
      payload.append("commitmentLevel", formData.commitmentLevel);
      if (formData.startupStage)
        payload.append("startupStage", formData.startupStage);
      if (formData.fundingStatus)
        payload.append("fundingStatus", formData.fundingStatus);
      if (
        formData.yearsExperience !== "" &&
        formData.yearsExperience !== undefined
      )
        payload.append("yearsExperience", toNumber(formData.yearsExperience));
      if (formData.teamSize !== "" && formData.teamSize !== undefined)
        payload.append("teamSize", toNumber(formData.teamSize));
      payload.append("lookingForCofounder", formData.lookingForCofounder);

      if (
        formData.lookingForCofounder &&
        formData.preferredCofounderExperience !== "" &&
        formData.preferredCofounderExperience !== undefined
      ) {
        payload.append(
          "preferredCofounderExperience",
          toNumber(formData.preferredCofounderExperience)
        );
      }

      if (formData.startupDescription?.trim()) {
        payload.append(
          "startupDescription",
          formData.startupDescription.trim()
        );
      }

      // Array fields
      toArray(formData.skills).forEach((skill) =>
        payload.append("skills", skill.trim())
      );
      toArray(formData.interests).forEach((interest) =>
        payload.append("interests", interest.trim())
      );
      toArray(formData.industryTags).forEach((tag) =>
        payload.append("industryTags", tag.trim())
      );

      if (formData.lookingForCofounder) {
        toArray(formData.preferredCofounderSkills).forEach((skill) =>
          payload.append("preferredCofounderSkills", skill.trim())
        );
      }

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

      await dispatch(createFounderProfile({ data: payload, token })).unwrap();

      toast.success("Founder profile created successfully!");
      setFormData(INITIAL_FORM_STATE);
      setProfileImageFile(null);
      setProfileImagePreview(user?.imageUrl || "/default-avatar.png");
    } catch (error) {
      console.error("Create profile error:", error);
      toast.error(error?.message || "Failed to create founder profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 pb-20 sm:mt-12 px-4 sm:px-6 lg:px-8 lg:pb-0">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Header with Image Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile preview"
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-border shadow-lg"
              />
            ) : (
              // Default avatar icon when no image
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-surface border-4 border-border shadow-lg flex items-center justify-center">
                <MdAccountCircle className="w-full h-full text-text-muted" />
              </div>
            )}

            {/* Camera Button */}
            <label
              htmlFor="create-profile-image"
              className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-accent-hover transition flex items-center justify-center"
            >
              <MdCameraAlt className="w-5 h-5" />
            </label>

            {/* Hidden File Input */}
            <input
              id="create-profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Remove Image Button (only when a new file is selected) */}
            {profileImageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-error text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition flex items-center justify-center"
                title="Remove image"
              >
                <MdDeleteOutline className="w-5 h-5" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-text-primary">
              Create Founder Profile
            </h2>
            <p className="text-sm sm:text-base text-text-muted mt-2">
              Build a strong, signal-rich profile to attract the right
              co-founders.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Commitment Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
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
            placeholder="e.g. React, Node.js, Python, Product Design"
          />
          <ChipInput
            label="Interests / Domains"
            value={formData.interests}
            onChange={(v) => handleChipChange("interests", v)}
            placeholder="e.g. AI, Fintech, Climate, Education"
          />
          <ChipInput
            label="Industry Tags"
            value={formData.industryTags}
            onChange={(v) => handleChipChange("industryTags", v)}
            placeholder="e.g. B2B, Consumer, Healthtech, SaaS"
          />

          {/* Startup Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
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
              <label className="block text-sm font-medium text-text-primary mb-2">
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
                <option value="none">None</option>
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
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Equity Offered to Co-founder (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberInput
                label="Min Equity (%)"
                name="equityOfferedMin"
                min="0"
                max="100"
                placeholder="50"
                value={formData.equityOfferedMin}
                onChange={handleChange}
              />
              <NumberInput
                label="Max Equity (%)"
                name="equityOfferedMax"
                min="0"
                max="100"
                placeholder="50"
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
            <label className="block text-sm font-medium text-text-primary mb-2">
              Startup Description
            </label>
            <textarea
              name="startupDescription"
              rows={6}
              maxLength={2000}
              placeholder="Describe your idea, the problem it solves, progress so far, and your vision..."
              value={formData.startupDescription}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-text-muted mt-1 text-right">
              {formData.startupDescription.length}/2000
            </p>
          </div>

          {/* Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Links (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                name="github"
                placeholder="GitHub URL"
                value={formData.github}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="url"
                name="website"
                placeholder="Personal or Startup Website"
                value={formData.website}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Looking for Co-founder */}
          <label className="flex items-center gap-3 cursor-pointer text-lg font-medium text-text-primary">
            <input
              type="checkbox"
              name="lookingForCofounder"
              checked={formData.lookingForCofounder}
              onChange={handleChange}
              className="h-6 w-6 text-accent rounded focus:ring-accent"
            />
            <span>I’m looking for a co-founder</span>
          </label>

          {formData.lookingForCofounder && (
            <div className="space-y-6 pl-0 sm:pl-8 border-l-0 sm:border-l-4 border-accent bg-accent/5 rounded-xl p-6 -mx-6">
              <ChipInput
                label="Preferred Co-founder Skills"
                value={formData.preferredCofounderSkills}
                onChange={(v) =>
                  handleChipChange("preferredCofounderSkills", v)
                }
                placeholder="e.g. Marketing, Go, Sales, DevOps"
              />
              <NumberInput
                label="Preferred Experience (years)"
                name="preferredCofounderExperience"
                min="0"
                placeholder="e.g. 3+ years"
                value={formData.preferredCofounderExperience}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent text-white font-semibold py-4 text-lg disabled:opacity-60 transition-all hover:bg-accent-hover"
          >
            {loading ? "Creating Profile..." : "Create Founder Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */

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

export default CreateFounderProfile;