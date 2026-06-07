import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import quote1 from "@/assets/quotes/quote1.png";
import quote2 from "@/assets/quotes/quote2.png";
import quote3 from "@/assets/quotes/quote3.png";

const images = [quote1, quote2, quote3];
const AUTOPLAY_DELAY = 6000; // 6 seconds per slide

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.4 },
    },
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const QuoteSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeIndex = (page % images.length + images.length) % images.length;

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Handle slide autoplay progression
  useEffect(() => {
    if (!isPlaying) {
      if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
      return;
    }

    autoplayTimeout.current = setTimeout(() => {
      paginate(1);
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
    };
  }, [page, isPlaying, paginate]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 mb-6">
      <div 
        className="relative group/slider overflow-hidden rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[16/9] bg-black/5"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Quote Slides */}
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            >
              <img
                src={images[activeIndex]}
                alt={`Quote ${activeIndex + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow - overlays on hover */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-black/40 hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none opacity-0 group-hover/slider:opacity-100 flex items-center justify-center shadow-lg backdrop-blur-sm"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow - overlays on hover */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-black/40 hover:bg-primary/90 text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none opacity-0 group-hover/slider:opacity-100 flex items-center justify-center shadow-lg backdrop-blur-sm"
            aria-label="Next quote"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Pagination dots below the image (without any background frame) */}
      <div className="flex justify-center items-center gap-2.5 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const diff = index - activeIndex;
              if (diff !== 0) {
                paginate(diff);
              }
            }}
            className={`h-2.5 rounded-full transition-all duration-500 focus:outline-none ${
              activeIndex === index
                ? "w-8 bg-primary"
                : "w-2.5 bg-primary/20 hover:bg-primary/45"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteSlider;
