import { motion } from "framer-motion";
import { Clock, BookOpen, GraduationCap, Globe, MapPin } from "lucide-react";
import type { CourseCatalog } from "@/types";

interface CourseCatalogCardProps {
  catalog: CourseCatalog;
  index: number;
}

const CourseCatalogCard = ({ catalog, index }: CourseCatalogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-primary/5 flex flex-col h-full group"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={catalog.thumbnail} 
          alt={catalog.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="inline-block px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-2 shadow-lg">
            Academic Course
          </div>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight drop-shadow-md">
            {catalog.name}
          </h3>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow bg-[#FDFCFB]">
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3 italic">
          "{catalog.description}"
        </p>

        <div className="mt-auto space-y-4 pt-6 border-t border-primary/5">
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Duration</span>
                <span className="text-xs font-semibold text-primary block">{catalog.duration}</span>
              </div>
            </div>

            {/* Mode */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                {catalog.mode && catalog.mode.toLowerCase() === "offline" ? (
                  <MapPin className="w-4 h-4 text-primary" />
                ) : (
                  <Globe className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Mode</span>
                <span className="text-xs font-semibold text-primary block">{catalog.mode || "Online"}</span>
              </div>
            </div>
          </div>
          
          {/* Level / Criteria */}
          <div className="flex items-start gap-2 pt-2 border-t border-primary/5">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-grow">
              <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Eligibility / Criteria</span>
              <span className="text-xs font-semibold text-primary block leading-relaxed">{catalog.enrollmentCriteria}</span>
            </div>
          </div>

          <div className="pt-4 flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-primary/5">
            <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-primary/70 leading-relaxed">
              <span className="font-bold text-primary block mb-1 uppercase tracking-wider text-[9px]">What you'll learn</span>
              {catalog.curriculumSummary}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCatalogCard;
