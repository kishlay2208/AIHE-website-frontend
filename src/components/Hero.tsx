import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end pb-20 md:pb-32 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Bottom-to-top gradient overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-sans text-white/90 font-bold tracking-widest uppercase text-xs sm:text-sm mb-4 drop-shadow-md"
          >
            ISKCON Ujjain presents
          </motion.p>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-2xl">
            Avantika Institute
            <br />
            <span className="text-orange-light">for Higher</span>
            <br />
            Education
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-serif italic text-white font-semibold text-lg sm:text-xl md:text-2xl mb-3 leading-relaxed drop-shadow-lg"
          >
            Systematic Spiritual Education
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-sans text-white/90 font-medium text-base sm:text-lg md:text-xl mb-10 max-w-xl leading-relaxed drop-shadow-lg"
          >
            Embark on a transformative journey through authentic Vedic wisdom
            and timeless teachings of the Bhakti tradition.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="default"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-8 h-14 text-lg shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href="#courses">
                <BookOpen className="w-6 h-6 mr-2" />
                Explore Courses
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 font-bold px-8 h-14 text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href="#instructors">
                Meet Our Faculty
                <ArrowRight className="w-6 h-6 ml-2" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
