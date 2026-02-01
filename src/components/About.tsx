import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Users, Award, Heart } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Authentic Teachings",
    description: "Study directly from scriptures under guidance of experienced devotee teachers.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Join a global community of sincere seekers on the path of Bhakti.",
  },
  {
    icon: Award,
    title: "Certified Courses",
    description: "Receive recognized certifications upon successful course completion.",
  },
  {
    icon: Heart,
    title: "Spiritual Growth",
    description: "Transform your life through practical application of Vedic wisdom.",
  },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-lavender" ref={ref}>
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            About Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-4 mb-6">
            Nurturing Spiritual Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Avantika Institute for Higher Education (AIHE) is a subsidiary of ISKCON Ujjain,
            dedicated to providing systematic spiritual education in the Gaudiya Vaishnava tradition.
            Our courses are designed to deepen your understanding of Vedic philosophy and
            support your journey on the path of devotional service.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-xl shadow-lg hover-lift text-center card-violet-border"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 p-8 md:p-12 bg-card rounded-2xl border border-primary/20 text-center shadow-lg"
        >
          <blockquote className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed max-w-3xl mx-auto">
            "The purpose of education is to lead one from darkness to light, from ignorance to knowledge,
            and ultimately to the loving service of the Supreme Lord."
          </blockquote>
          <p className="text-primary mt-6 font-medium">
            — Based on the teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
