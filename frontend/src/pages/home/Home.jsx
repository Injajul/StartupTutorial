import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import RecommendFounders from "./RecommendedFounders";
import RecommendInvestors from "./RecommendedInvestors";

// Icons
import {
  FiArrowRight,
  FiUsers,
  FiTrendingUp,
  FiSearch,
} from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();

  const { currentAuthUser, authUserLoading } = useSelector(
    (state) => state.user
  );

  if (authUserLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-lg">Loading your world…</p>
      </div>
    );
  }

  const activeRole = currentAuthUser?.activeRole;
  const hasProfile = !!currentAuthUser?.profile;

  return (
    <div className="min-h-screen bg-bg">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sm:flex flex-col justify-center items-center max-w-3xl"
          >
            <h1 className="text-2xl md:text-4xl font-black text-text-primary leading-tight">
              Build with the right people.
              <br />
              <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                Faster. Smarter. Together.
              </span>
            </h1>

            <p className="mt-6 text-xl max-w-xs text-text-muted md:max-w-xl">
              Discover co-founders and investors aligned with your vision, 
            </p>

            {/* Primary Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              {!activeRole && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/select-role")}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-gradient-to-r from-accent to-accent-hover
                    text-white font-bold shadow-xl hover:shadow-accent/40"
                >
                  <FiUsers className="w-5 h-5" />
                  Get Started
                </motion.button>
              )}

              {activeRole && !hasProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    navigate(
                      activeRole === "founder"
                        ? "/founders/create"
                        : "/investors/create"
                    )
                  }
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-gradient-to-r from-accent to-accent-hover
                    text-white font-bold shadow-xl hover:shadow-accent/40"
                >
                  <FiTrendingUp className="w-5 h-5" />
                  Create Your Profile
                </motion.button>
              )}

              {activeRole && hasProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/discover")}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl
                    bg-surface border border-border
                    text-text-primary font-bold shadow-lg hover:shadow-xl"
                >
                  <FiSearch className="w-5 h-5" />
                  Discover Matches
                  <FiArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-24 w-96 h-96 bg-accent-secondary/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ================= RECOMMENDATIONS ================= */}
      <main className="pb-24">
        {/* Founder Experience */}
        {activeRole === "founder" && hasProfile && (
          <>
            <RecommendFounders />
            <RecommendInvestors />
          </>
        )}

        {/* Investor Experience */}
        {activeRole === "investor" && hasProfile && (
          <>
            <RecommendFounders />
          </>
        )}

        {/* New / No Profile */}
        {!activeRole && (
          <section className="mt-20 text-center px-6">
            <h2 className="text-2xl font-bold text-text-primary">
              A smarter way to connect
            </h2>
            <p className="mt-3 text-text-muted max-w-xl mx-auto">
              Profiles are matched using skills, experience, industries, and
              intent — not random scrolling.
            </p>
          </section>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} FABLE — Building meaningful startup
            connections.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;