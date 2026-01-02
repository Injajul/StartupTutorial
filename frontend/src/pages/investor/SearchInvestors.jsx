import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { searchInvestors } from "../../redux/slices/investorSlice";
import InvestorCard from "./InvestorCard";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaDollarSign,
  FaIndustry,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
const SearchInvestors = () => {
  const dispatch = useDispatch();
 
  const { searchResults, loading } = useSelector((state) => state.investor);
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  

  const [filters, setFilters] = useState({
    investorType: "",
    preferredStages: "",
    preferredIndustries: "",
    geography: "",
  });

  // 🔹 Build active filters
  const buildActiveFilters = () => {
    const active = {};

    if (searchQuery.trim()) {
      active.preferredIndustries = searchQuery;
      active.preferredStages = searchQuery;
      active.geography = searchQuery;
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
        searchInvestors({
          filters: buildActiveFilters(),
          token,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, dispatch, getToken]);

  const clearAll = () => {
    setSearchQuery("");
    setFilters({
      investorType: "",
      preferredStages: "",
      preferredIndustries: "",
      geography: "",
    });
    setShowFilters(false);
  };



  const resultsCount = searchResults?.length || 0;

 

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-20">
      {/* 🔍 Search bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stages, industries, geography..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-card border border-border hover:bg-accent/10 transition"
        >
          <FaFilter className="text-accent" />
          {/* Label hidden on mobile */}
          <span className="hidden lg:inline font-medium text-text-primary">
            Filters
          </span>
        </button>
      </div>

      {/* 📊 Results header */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-text-primary">
          {loading
            ? "Searching..."
            : `${resultsCount} Investor${resultsCount !== 1 ? "s" : ""} Found`}
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
      {!loading && searchResults?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {searchResults.map((investor) => (
            <InvestorCard key={investor._id} investor={investor} />
          ))}
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && resultsCount === 0 && (
        <div className="text-center py-20">
          <FaSearch className="text-6xl text-accent/20 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            No Investors Found
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

            {/* Investor Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                <FaDollarSign className="inline mr-2 text-accent" />
                Investor Type
              </label>
              <select
                value={filters.investorType}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    investorType: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-bg px-4 py-3"
              >
                <option value="">Any</option>
                <option value="angel">Angel</option>
                <option value="vc">VC</option>
                <option value="syndicate">Syndicate</option>
                <option value="corporate">Corporate</option>
                <option value="accelerator">Accelerator</option>
              </select>
            </div>

            {/* Stages */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Preferred Stages
              </label>
              <input
                value={filters.preferredStages}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    preferredStages: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-bg px-4 py-3"
                placeholder="pre-seed, seed"
              />
            </div>

            {/* Industries */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                <FaIndustry className="inline mr-2 text-accent" />
                Industries
              </label>
              <input
                value={filters.preferredIndustries}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    preferredIndustries: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-bg px-4 py-3"
                placeholder="AI, Fintech"
              />
            </div>

            {/* Geography */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                <FaMapMarkedAlt className="inline mr-2 text-accent" />
                Geography
              </label>
              <input
                value={filters.geography}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    geography: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-bg px-4 py-3"
                placeholder="USA, Europe"
              />
            </div>

            {/* Actions */}
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

export default SearchInvestors;