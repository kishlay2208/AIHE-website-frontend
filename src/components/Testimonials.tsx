import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTestimonials } from "@/services/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const { data: testimonialsData, isLoading } = useTestimonials();
  const testimonials = testimonialsData?.data || [];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, testimonials]);

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 md:py-28 bg-[#2C1E4A] text-light-bg text-center">
        <p className="text-light-bg/70 animate-pulse">Loading testimonials...</p>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-[#2C1E4A] text-light-bg overflow-hidden relative"
    >
      {/* Solid gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#25183E]/80 via-[#2C1E4A]/30 to-[#25183E]/80 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-orange-light font-bold tracking-[0.2em] text-xs sm:text-sm uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4 tracking-wide">
            Voices of Transformation
          </h2>
          <p className="font-sans text-light-bg/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Hear from our students about their journey of spiritual growth and self-realization.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-6xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          {/* Custom Left Arrow Button */}
          {testimonials.length > 1 && (
            <button
              onClick={handlePrevious}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-orange text-[#2C1E4A] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shrink-0 z-20 focus:outline-none hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

          {/* Carousel */}
          <div className="w-full overflow-hidden px-1 md:px-2">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: testimonials.length > 3,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((t, index) => (
                  <CarouselItem key={t.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white text-primary rounded-[2rem] p-8 md:p-10 shadow-xl border border-primary/5 flex flex-col h-full relative overflow-hidden group min-h-[320px] justify-between"
                    >
                      {/* Quotation Icon Graphic */}
                      <div className="text-[#2C1E4A]/5 text-7xl md:text-8xl font-serif leading-none select-none absolute top-4 left-6 pointer-events-none group-hover:text-orange/10 transition-colors duration-500">
                        &ldquo;
                      </div>

                      {/* Comment text */}
                      <div className="relative z-10 flex-grow flex items-center mb-6 pt-8">
                        <p className="font-serif italic text-sm sm:text-base md:text-lg leading-relaxed text-[#4A3E65]">
                          &ldquo;{t.comments}&rdquo;
                        </p>
                      </div>

                      {/* Author Info */}
                      <div className="relative z-10 border-t border-primary/5 pt-5 flex items-center gap-4">
                        <img 
                          src={t.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`} 
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#2C1E4A]/10 shrink-0 shadow-sm"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`;
                          }}
                        />
                        <div className="text-left">
                          <h4 className="font-sans font-bold text-sm sm:text-base text-[#2C1E4A] leading-tight">
                            {t.name}
                          </h4>
                          <p className="font-sans text-xs text-[#8B7E9F] mt-1 leading-normal">
                            <span className="font-semibold text-orange-light">{t.title}</span>
                            {t.place && (
                              <span className="text-[#8B7E9F]/60"> • {t.place}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Custom Right Arrow Button */}
          {testimonials.length > 1 && (
            <button
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-orange text-[#2C1E4A] hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg shrink-0 z-20 focus:outline-none hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${
                  current === index
                    ? "w-6 bg-orange"
                    : "bg-light-bg/20 hover:bg-light-bg/40 w-2"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
