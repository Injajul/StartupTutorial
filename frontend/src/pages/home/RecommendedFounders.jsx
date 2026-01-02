import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { SwiperSlide } from "swiper/react";

import { fetchRecommendedFounders } from "../../redux/slices/recommendationSlice";
import FounderCard from "../founder/FounderCard";
import SwipeContainer from "../../components/user/SwipeContainer";

const RecommendFounders = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { founders, loadingFounders } = useSelector(
    (state) => state.recommendations
  );

  console.log("founders",founders)
  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      dispatch(fetchRecommendedFounders(token));
    };
    load();
  }, [dispatch, getToken]);

  if (loadingFounders) {
    return (
      <div className="px-6 py-8 text-text-muted">
        Finding the best co-founders for you…
      </div>
    );
  }

  if (!founders || founders.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-text-primary mb-5 px-6">
        Recommended Co-Founders
      </h2>

      <div className="pl-6">
        <SwipeContainer>
          {founders.map((founder) => (
            <SwiperSlide
              key={founder._id}
              className="
  !w-[50%]
  sm:!w-[320px]
  lg:!w-[340px]
  xl:!w-[360px]
"

            >
              <FounderCard founder={founder} />
            </SwiperSlide>
          ))}
        </SwipeContainer>
      </div>
    </section>
  );
};

export default RecommendFounders;