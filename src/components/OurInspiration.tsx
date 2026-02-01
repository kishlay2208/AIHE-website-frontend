import { useState } from "react";
import { motion } from "framer-motion";
import srilaPrabhupada from "@/assets/inspiration/srila-prabhupada.png";
import bhaktiCharuSwami from "@/assets/inspiration/bhakti-charu-swami.png";
import bhaktiPremaSwami from "@/assets/inspiration/bhakti-prema-swami.png";

interface InspirationCard {
  id: string;
  name: string;
  title: string;
  image: string;
  quote: string;
}

const inspirations: InspirationCard[] = [
  {
    id: "prabhupada",
    name: "Srila Prabhupada",
    title: "Founder-Acharya of ISKCON",
    image: srilaPrabhupada,
    quote: "Human life is meant for God realization.",
  },
  {
    id: "bhakti-charu",
    name: "HH Bhakti Charu Swami Maharaja",
    title: "Visionary Leader, Disciple of Srila Prabhupada",
    image: bhaktiCharuSwami,
    quote: "Service to the devotees is the highest service.",
  },
  {
    id: "bhakti-prema",
    name: "HH Bhakti Prema Swami Maharaja",
    title: "Guide, AIHE",
    image: bhaktiPremaSwami,
    quote: "Education in devotion transforms the heart.",
  },
];

const OurInspiration = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="inspiration" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-light-bg mb-4 tracking-wide">
            Our Inspiration
          </h2>
          <p className="text-light-bg/70 text-lg max-w-2xl mx-auto">
            Honoring the spiritual lineage (Parampara) that guides our institute
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                    ? "shadow-[0_0_40px_rgba(254,252,253,0.3)]"
                    : "shadow-lg"
                }`}
              >
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-light-bg">
                  <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                  <p className="text-light-bg/70 text-sm mb-3">{person.title}</p>

                  {/* Quote on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredId === person.id ? 1 : 0,
                      height: hoveredId === person.id ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-light-bg/90 italic text-sm border-l-2 border-orange pl-3">
                      "{person.quote}"
                    </p>
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
