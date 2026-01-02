import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllFounders } from "../../redux/slices/founderSlice";
import FounderCard from "./FounderCard";
import { FaUsers } from "react-icons/fa";

const AllFounders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allFounders, loading } = useSelector((state) => state.founder);
  console.log("allFounders", allFounders);
  useEffect(() => {
    dispatch(fetchAllFounders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-4 border-accent rounded-full" />
      </div>
    );
  }

  if (!allFounders?.length) {
    return (
      <div className="text-center py-20">
        <FaUsers className="text-7xl mx-auto text-accent/30 mb-6" />
        <h2 className="text-2xl font-bold">No founders yet</h2>
      </div>
    );
  }

  return (
    <>
      <div className="text-center  mb-14">
        <h1 className="text-4xl font-bold mb-4 text-text-primary">
          Find Your Co-Founder
        </h1>
        <p className="text-text-muted">
          Builders looking for other serious builders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allFounders.map((founder) => (
          <FounderCard
            key={founder._id}
            founder={founder}
            onClick={(id) => navigate(`/founders/${id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default AllFounders;