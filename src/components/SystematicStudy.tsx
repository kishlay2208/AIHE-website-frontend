import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen } from "lucide-react";

const verses = [
  {
    reference: "Śrī Caitanya-caritāmṛta, Madhya 22.65",
    sanskrit: `śāstra-yuktye sunipuṇa, dṛḍha-śraddhā yāṅra
'uttama-adhikārī' sei tāraye saṁsāra`,
    translation:
      "One who is expert in logic and understanding of revealed scriptures, and who has firm faith, is classified as a topmost devotee. He can deliver the whole world.",
  },
  {
    reference: "Śrī Caitanya-caritāmṛta, Ādi 2.117",
    sanskrit: `siddhānta baliyā citte nā kara alasa
ihā ha-ite kṛṣṇe lāge sudṛḍha mānasa`,
    translation:
      "A sincere student should not neglect the discussion of such conclusions, considering them controversial, for such discussions strengthen the mind. Thus one's mind becomes attached to Śrī Kṛṣṇa.",
  },
];

const SystematicStudy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="systematic-study"
      className="section-padding bg-background"
      ref={ref}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            Foundation
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-4 mb-6">
            The Importance of Systematic Study
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            The Gaudiya Vaishnava tradition emphasizes the importance of
            studying scriptures systematically under proper guidance. Here is
            what the śāstras say:
          </p>
        </motion.div>

        {/* Verses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {verses.map((verse, index) => (
            <motion.div
              key={verse.reference}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Parchment-style Card */}
              <div className="bg-[#faf8f3] border-2 border-primary rounded-xl p-8 shadow-lg relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-xl" />

                {/* Reference */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-primary font-semibold text-sm tracking-wide">
                    {verse.reference}
                  </span>
                </div>

                {/* Sanskrit Verse */}
                <blockquote className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed mb-6 pl-4 border-l-4 border-accent">
                  {verse.sanskrit}
                </blockquote>

                {/* Translation */}
                <p className="text-muted-foreground text-base leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Translation:{" "}
                  </span>
                  {verse.translation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            At AIHE, we provide a structured curriculum that enables sincere
            students to develop firm faith through systematic study of the
            revealed scriptures.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SystematicStudy;
