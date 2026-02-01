import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-primary-foreground/80 font-medium tracking-widest uppercase text-sm mb-6"
          >
            ISKCON Ujjain presents
          </motion.p>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight tracking-wide mb-6">
            Avantika Institute
            <br />
            <span className="text-orange-light">for Higher</span>
            <br />
            Education
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mb-4 leading-relaxed"
          >
            Systematic Spiritual Education
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-primary-foreground/70 text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
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
            <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <a href="#courses">
                <BookOpen className="w-5 h-5" />
                Explore Courses
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="#instructors">
                Meet Our Faculty
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
