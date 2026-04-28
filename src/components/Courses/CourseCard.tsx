import { motion } from "framer-motion";
import { Calendar, Globe, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  index: number;
  onRegister: (course: Course) => void;
}

const CourseCard = ({ course, index, onRegister }: CourseCardProps) => {
  const { catalog } = course;
  const title = catalog?.name || "Loading...";
  const thumbnail = catalog?.thumbnail || "/placeholder.svg";
  const description = catalog?.description || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-primary/5 flex flex-col group h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
        <div className="absolute top-4 right-4">
          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl backdrop-blur-md border ${
            course.status === "Closed" 
              ? "bg-red-500/90 text-white border-red-400/30" 
              : "bg-green-500/90 text-white border-green-400/30"
          }`}>
            {course.status === "Closed" ? "Registration (Closed)" : "Registration (Open)"}
          </div>
        </div>
        <div className="absolute bottom-5 left-6 right-6">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 italic">
          {description}
        </p>

        <div className="space-y-4 mb-8 bg-secondary/20 p-5 rounded-2xl border border-primary/5">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Schedule</span>
              <span className="text-xs font-semibold text-primary">{course.startDate}{course.endDate ? ` - ${course.endDate}` : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Medium & Mode</span>
              <span className="text-xs font-semibold text-primary">{course.language} • {course.mode}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-primary/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Course Fee</span>
            <div className="flex items-baseline gap-1 text-primary">
              {course.currency === "INR" || !course.currency ? <IndianRupee className="w-4 h-4" /> : <span className="text-xs font-bold">{course.currency} </span>}
              <span className="text-2xl font-bold">{course.fee > 0 ? Number(course.fee).toLocaleString() : "Free"}</span>
            </div>
          </div>
          
          <Button 
            variant={course.status === "Closed" ? "secondary" : "default"} 
            size="lg"
            onClick={() => onRegister(course)}
            disabled={course.status === "Closed"}
            className={`rounded-2xl px-8 font-bold transition-all duration-300 ${
              course.status === "Closed" 
                ? "opacity-50 grayscale" 
                : "bg-primary hover:bg-black hover:scale-105 shadow-lg hover:shadow-primary/20"
            }`}
          >
            {course.status === "Closed" ? "Closed" : course.registrationFormUrl ? "Register Now" : "Register"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
