import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFounders } from "../../redux/slices/founderSlice";
import FounderCard from "./FounderCard";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import ChipInput from "../../components/user/ChipInput";
import { useAuth } from "@clerk/clerk-react";
const SearchFounders = () => {
  const dispatch = useDispatch();
  const { founders, loading } = useSelector((state) => state.founder);
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);


  const [filters, setFilters] = useState({
    skills: "",
    interests: "",
    industryTags: "",
    startupStage: "",
    commitmentLevel: "",
    lookingForCofounder: "",
  });

  // 🔹 Build filters payload
  const buildActiveFilters = () => {
    const active = {};

    if (searchQuery.trim()) {
      active.skills = searchQuery;
      active.interests = searchQuery;
      active.industryTags = searchQuery;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) active[key] = value;
    });

    return active;
  };

  // 🔹 Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      const token = await getToken();

      dispatch(
        searchFounders({
          filters: buildActiveFilters(),
          token,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, searchQuery, dispatch, getToken]);

  const clearAll = () => {
    setSearchQuery("");
    setFilters({
      skills: "",
      interests: "",
      industryTags: "",
      startupStage: "",
      commitmentLevel: "",
      lookingForCofounder: "",
    });
    setShowFilters(false);
  };

  const resultsCount = founders?.length || 0;

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-20">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, interests, industries..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-card border border-border hover:bg-accent/10 transition"
        >
          <FaFilter className="text-accent" />
          <span className="hidden lg:inline font-medium text-text-primary">
            Filters
          </span>
        </button>
      </div>

      {/* 📊 Results Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaUsers className="text-accent text-xl" />
        <p className="text-lg font-semibold text-text-primary">
          {loading
            ? "Searching..."
            : `${resultsCount} Founder${resultsCount !== 1 ? "s" : ""} Found`}
        </p>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 animate-pulse"
            >
              <div className="h-48 bg-surface rounded-xl mb-4" />
              <div className="h-6 bg-surface rounded mb-3" />
              <div className="h-4 bg-surface rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* 🧱 Results */}
      {!loading && founders?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {founders.map((founder) => (
            <FounderCard key={founder._id} founder={founder} />
          ))}
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && resultsCount === 0 && (
        <div className="text-center py-20">
          <FaSearch className="text-6xl text-accent/20 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            No Founders Found
          </h3>
          <p className="text-text-muted">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* 🪟 Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md h-full text-text-primary bg-card border-l border-border p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <FaTimes className="text-text-muted text-xl" />
              </button>
            </div>

            {/* Looking for Co-founder */}
            <label className="flex items-center gap-3 mb-8 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.lookingForCofounder === "true"}
                onChange={() =>
                  setFilters((p) => ({
                    ...p,
                    lookingForCofounder:
                      p.lookingForCofounder === "true" ? "" : "true",
                  }))
                }
                className="h-5 w-5 text-accent rounded"
              />
              <span className="font-medium flex items-center gap-2">
                <FaHandshake className="text-accent" />
                Actively Seeking Co-founder
              </span>
            </label>

            <ChipInput
              label="Skills"
              value={filters.skills}
              onChange={(v) => setFilters((p) => ({ ...p, skills: v }))}
            />
            <ChipInput
              label="Interests"
              value={filters.interests}
              onChange={(v) => setFilters((p) => ({ ...p, interests: v }))}
            />
            <ChipInput
              label="Industry"
              value={filters.industryTags}
              onChange={(v) => setFilters((p) => ({ ...p, industryTags: v }))}
            />

            <div className="flex gap-3 mt-8">
              <button
                onClick={clearAll}
                className="flex-1 py-3 rounded-xl border border-border text-text-secondary hover:bg-surface"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-xl bg-accent text-white font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFounders;