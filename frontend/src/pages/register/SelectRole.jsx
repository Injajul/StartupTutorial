import { useNavigate } from "react-router-dom";
import React from "react"
const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How do you want to use the platform?
          </h1>
          <p className="text-gray-400 text-lg">
            You can switch roles later. Choose what fits your goal right now.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Founder Card */}
          <div
            onClick={() => navigate("/founders/create")}
            className="cursor-pointer rounded-2xl border border-gray-700 bg-gray-900/60 p-8 hover:border-indigo-500 hover:shadow-indigo-500/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-semibold text-white mb-4">
                I’m a Founder
              </h2>

              <p className="text-gray-400 mb-6 flex-grow">
                Build startups, find co-founders, connect with investors, and
                raise capital.
              </p>

              <div className="mt-auto">
                <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                  Continue as Founder →
                </button>
              </div>
            </div>
          </div>

          {/* Investor Card */}
          <div
            onClick={() => navigate("/investors/create")}
            className="cursor-pointer rounded-2xl border border-gray-700 bg-gray-900/60 p-8 hover:border-emerald-500 hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-semibold text-white mb-4">
                I’m an Investor
              </h2>

              <p className="text-gray-400 mb-6 flex-grow">
                Discover founders, evaluate startups, and invest in high-potential ideas.
              </p>

              <div className="mt-auto">
                <button className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                  Continue as Investor →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          You can change your role anytime from your account settings.
        </div>
      </div>
    </div>
  );
};

export default SelectRole;