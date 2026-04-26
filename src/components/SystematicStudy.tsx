import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen } from "lucide-react";

const verses = [
  {
    reference: "Bhagavad-gītā 16.24",
    devanagari: "तस्माच्छास्त्रं प्रमाणं ते कार्याकार्यव्यवस्थितौ ।\nज्ञात्वा शास्त्रविधानोक्तं कर्म कर्तुमिहार्हसि ॥ २४ ॥",
    sanskrit: `tasmāc chāstraṁ pramāṇaṁ te\nkāryākārya-vyavasthitau\njñātvā śāstra-vidhānokta\u1e41\nkarma kartum ihārhasi`,
    translation:
      "One should therefore understand what is duty and what is not duty by the regulations of the scriptures. Knowing such rules and regulations, one should act so that he may gradually be elevated.",
  },
  {
    reference: "Bhagavad-gītā 5.18",
    devanagari: "विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि ।\nशुनि चैव श्वपाके च पण्डिता: समदर्शिन: ॥ १८ ॥",
    sanskrit: `vidyā-vinaya-sampanne\nbrāhma\u1e47e gavi hastini\nśuni caiva śva-pāke ca\npa\u1e47\u1e0ditāḥ sama-darśinaḥ`,
    translation:
      "The humble sages, by virtue of true knowledge, see with equal vision a learned and gentle brāhmaṇa, a cow, an elephant, a dog and a dog-eater [outcaste].",
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
              <div className="bg-[#faf8f3] border-2 border-primary rounded-xl p-8 shadow-lg relative overflow-hidden h-full flex flex-col items-center">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-xl" />

                {/* Reference */}
                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-primary font-bold text-sm tracking-widest uppercase">
                    {verse.reference}
                  </span>
                </div>

                {/* Sanskrit Verses */}
                <div className="mb-6 space-y-4">
                  <p className="font-serif text-xl sm:text-2xl text-primary font-bold leading-relaxed whitespace-pre-line text-center">
                    {verse.devanagari}
                  </p>
                  <p className="font-serif text-base sm:text-lg text-foreground/80 italic leading-relaxed whitespace-pre-line text-center">
                    {verse.sanskrit}
                  </p>
                </div>

                {/* Translation */}
                <div className="space-y-6 mt-auto w-full">
                  <div className="text-center">
                    <div className="h-px w-12 bg-primary/20 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      <span className="font-bold text-foreground block mb-2 uppercase tracking-tight text-xs">
                        Translation
                      </span>
                      {verse.translation}
                    </p>
                  </div>

                  {(verse as any).note && (
                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                      <p className="text-xs sm:text-sm font-sans font-medium text-primary/80 italic text-center leading-relaxed">
                        &ldquo;{(verse as any).note}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
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
