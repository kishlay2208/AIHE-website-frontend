import { useState } from "react";
import { motion } from "framer-motion";
import srilaPrabhupada from "@/assets/inspiration/srila-prabhupada.png";
import bhaktiCharuSwami from "@/assets/inspiration/bhakti-charu-swami.png";
import bhaktiPremaSwami from "@/assets/inspiration/bhakti-prema-swami.png";

interface InspirationCard {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  quote?: string;
}

const inspirations: InspirationCard[] = [
  {
    id: "prabhupada",
    name: "His Divine Grace A.C. Bhaktivedanta Swami Prabhupada",
    title: "Founder-Acharya of the International Society for Krishna Consciousness",
    subtitle:
      "The World-Teacher who built a house in which the whole world can live, and the foremost authority on Bhakti-yoga in the modern era.",
    image: srilaPrabhupada,
  },
  {
    id: "bhakti-charu",
    name: "His Holiness Bhakti Charu Swami Maharaja",
    title: "An Embodiment of Vaishnava Etiquette and Devotional Excellence",
    subtitle:
      "A beloved disciple of Srila Prabhupada who dedicated his life to manifesting the beauty of the spiritual world through his culture, literature, and the establishment of systematic spiritual education.",
    image: bhaktiCharuSwami,
  },
  {
    id: "bhakti-prema",
    name: "His Holiness Bhakti Prema Swami Maharaja",
    title: "A Dedicated Servant of the Vision of his Spiritual Master",
    subtitle:
      "A scholar and sannyasi whose life is a testament to the power of systematic study, committed to guiding sincere seekers on the path of Bhakti through his realizations of the sacred scriptures.",
    image: bhaktiPremaSwami,
  },
];

const OurInspiration = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="inspiration" className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-orange-light font-medium tracking-widest uppercase text-xs sm:text-sm">
            Parampara
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-light-bg mt-3 mb-4 tracking-wide">
            Our Inspiration
          </h2>
          <p className="font-sans text-light-bg/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Honoring the spiritual lineage that guides our institute
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {inspirations.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative group"
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                  hoveredId === person.id
                    ? "shadow-[0_0_40px_rgba(254,252,253,0.25)] scale-[1.02]"
                    : "shadow-lg"
                }`}
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent opacity-85" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-light-bg">
                  {/* Name */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold mb-1 leading-snug">
                    {person.name}
                  </h3>

                  {/* Title */}
                  <p className="font-sans text-orange-light/90 text-xs sm:text-sm font-medium leading-snug mb-1">
                    {person.title}
                  </p>

                  {/* Subtitle visible on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredId === person.id ? 1 : 0,
                      height: hoveredId === person.id ? "auto" : 0,
                    }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans text-light-bg/80 text-xs sm:text-sm leading-relaxed mt-2 border-l-2 border-orange pl-3">
                      {person.subtitle}
                    </p>
                    {person.quote && (
                      <p className="font-serif italic text-light-bg/70 text-xs sm:text-sm mt-2">
                        &ldquo;{person.quote}&rdquo;
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurInspiration;
