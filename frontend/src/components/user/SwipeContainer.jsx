import React, { useRef } from "react";
import { Swiper } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "swiper/css";

const SwipeContainer = ({ children }) => {
  const swiperRef = useRef(null);

  const handlePrev = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slideNext();
  };

  return (
    <div className="relative w-full">
      {/* ⬅️ LEFT */}
      <button
        onClick={handlePrev}
        className="
          absolute left-3 text-text-primary top-1/2 -translate-y-1/2 z-50
          w-10 h-10 rounded-full
          bg-card border border-border
          flex items-center justify-center
          shadow-lg
          hover:scale-110 transition
        "
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      {/* ➡️ RIGHT */}
      <button
        onClick={handleNext}
        className="
          absolute text-text-primary right-3 top-1/2 -translate-y-1/2 z-50
          w-10 h-10 rounded-full
          bg-card border border-border
          flex items-center justify-center
          shadow-lg
          hover:scale-110 transition
        "
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[FreeMode]}
        slidesPerView={1}
        spaceBetween={16}
        freeMode={{
          enabled: true,
          momentumBounce: false,
        }}
        grabCursor
        resistanceRatio={0}
        watchOverflow={false}
        className="
          !overflow-visible
          pl-14
          pr-14
        "
      >
        {children}
      </Swiper>
    </div>
  );
};

export default SwipeContainer;