import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchInvestors } from "../../redux/slices/investorSlice";
import InvestorCard from "./InvestorCard";
import { FaUsers, FaDollarSign } from "react-icons/fa";

const AllInvestors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults: investors, loading } = useSelector(
    (state) => state.investor
  );

console.log("investors",investors)

  useEffect(() => {
    dispatch(searchInvestors({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center gap-4 text-text-muted">
          <div className="animate-spin h-12 w-12 border-b-4 border-accent rounded-full" />
          <span className="text-xl">Finding top investors...</span>
        </div>
      </div>
    );
  }

  if (!investors?.length) {
    return (
      <div className="text-center py-20">
        <FaDollarSign className="text-8xl mx-auto text-accent/20 mb-6" />
        <h2 className="text-3xl font-bold">No Investors Yet</h2>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Connect with Investors
        </h1>
        <p className="text-xl text-text-muted max-w-4xl mx-auto">
          From angels to VCs — find capital partners aligned with your vision.
        </p>

        <div className="mt-10 inline-flex items-center gap-3 bg-surface border border-border rounded-full px-8 py-4 shadow-lg">
          <FaUsers className="text-2xl text-accent" />
          <span className="text-xl font-bold">
            {investors.length} Active Investor
            {investors.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {investors.map((investor) => (
          <InvestorCard
            key={investor._id}
            investor={investor}
            onClick={(id) => navigate(`/investors/${id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default AllInvestors;