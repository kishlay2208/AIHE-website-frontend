import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Left-side gradient overlay — keeps right-side painting visible */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Glassmorphism Card */}
          <div className="hero-glass px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-sans text-primary-foreground/80 font-medium tracking-widest uppercase text-xs sm:text-sm mb-4"
            >
              ISKCON Ujjain presents
            </motion.p>

            {/* Main Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.15] tracking-wide mb-5">
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
              className="font-serif italic text-primary-foreground/90 text-base sm:text-lg md:text-xl mb-2 leading-relaxed"
            >
              Systematic Spiritual Education
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-sans text-primary-foreground/70 text-sm sm:text-base md:text-lg mb-8 leading-relaxed"
            >
              Embark on a transformative journey through authentic Vedic wisdom
              and timeless teachings of the Bhakti tradition.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-sans" asChild>
                <a href="#courses">
                  <BookOpen className="w-5 h-5" />
                  Explore Courses
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 font-sans" asChild>
                <a href="#instructors">
                  Meet Our Faculty
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
