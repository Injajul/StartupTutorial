import React, { useState } from "react";
import SearchFounders from "../founder/SearchCofounder";
import SearchInvestors from "../investor/SearchInvestors";
import { FaUsers, FaDollarSign } from "react-icons/fa";

const TABS = {
  FOUNDERS: "founders",
  INVESTORS: "investors",
};

const Discover = () => {
  const [activeTab, setActiveTab] = useState(TABS.FOUNDERS);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1">
        <div className="text-center mb-10">
         
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-surface border border-border rounded-2xl p-1 shadow-sm">
            {/* Founders Tab */}
            <button
              onClick={() => setActiveTab(TABS.FOUNDERS)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
                ${
                  activeTab === TABS.FOUNDERS
                    ? "bg-accent text-white shadow"
                    : "text-text-secondary hover:bg-accent/10"
                }
              `}
            >
              <FaUsers />
              Founders
            </button>

            {/* Investors Tab */}
            <button
              onClick={() => setActiveTab(TABS.INVESTORS)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
                ${
                  activeTab === TABS.INVESTORS
                    ? "bg-accent text-white shadow"
                    : "text-text-secondary hover:bg-accent/10"
                }
              `}
            >
              <FaDollarSign />
              Investors
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {activeTab === TABS.FOUNDERS && <SearchFounders />}
        {activeTab === TABS.INVESTORS && <SearchInvestors />}
      </div>
    </div>
  );
};

export default Discover;