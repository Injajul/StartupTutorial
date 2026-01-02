import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { SwiperSlide } from "swiper/react";

import { fetchRecommendedInvestors } from "../../redux/slices/recommendationSlice";
import InvestorCard from "../investor/InvestorCard";
import SwipeContainer from "../../components/user/SwipeContainer";

const RecommendInvestors = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { investors, loadingInvestors } = useSelector(
    (state) => state.recommendations
  );

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      dispatch(fetchRecommendedInvestors(token));
    };
    load();
  }, [dispatch, getToken]);

  if (loadingInvestors) {
    return (
      <div className="px-6 py-8 text-text-muted">
        Finding investors aligned with your startup…
      </div>
    );
  }

  if (!investors || investors.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-text-primary mb-5 px-6">
        Recommended Investors
      </h2>

      <div className="pl-6">
        <SwipeContainer>
          {investors.map((investor) => (
            <SwiperSlide
              key={investor._id}
              className="
    !w-[50%]
  sm:!w-[320px]
  lg:!w-[340px]
  xl:!w-[360px]
"
            >
              <InvestorCard investor={investor} />
            </SwiperSlide>
          ))}
        </SwipeContainer>
      </div>
    </section>
  );
};

export default RecommendInvestors;