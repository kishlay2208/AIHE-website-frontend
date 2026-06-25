import { motion } from "framer-motion";
import { Calendar, Globe, IndianRupee, Clock, CalendarDays, Timer, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types";
import { formatDate } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index: number;
  onRegister: (course: Course) => void;
}

const CourseCard = ({ course, index, onRegister }: CourseCardProps) => {
  const { catalog } = course;
  const title = catalog?.name || "Loading...";
  const thumbnail = course.thumbnail || catalog?.thumbnail || "/placeholder.svg";
  const description = catalog?.description || "";
  const isRegistrationOpen = !!course.registrationFormUrl;

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
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
        <div className="absolute top-4 right-4">
          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl backdrop-blur-md border ${
            isRegistrationOpen 
              ? "bg-green-500/90 text-white border-green-400/30" 
              : "bg-amber-500/90 text-white border-amber-400/30"
          }`}>
            {isRegistrationOpen ? "Registration Open" : "Coming Soon"}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6">
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-5 sm:p-8 flex flex-col flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 italic">
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-secondary/20 p-4 sm:p-5 rounded-2xl border border-primary/5">
          {/* Instructor */}
          <div className="flex items-center gap-3 col-span-1 sm:col-span-2 border-b border-primary/10 pb-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/10">
              {course.instructor?.image ? (
                <img 
                  src={course.instructor.image} 
                  alt={course.instructor.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary/70" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Instructor</span>
              <span className="text-xs font-bold text-primary leading-tight truncate">
                {course.instructor?.name || "TBA"}
              </span>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Dates</span>
              <span className="text-[10px] font-semibold text-primary leading-tight truncate">
                {formatDate(course.startDate)}
                {course.endDate ? ` - ${formatDate(course.endDate)}` : ""}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
              <Timer className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Duration</span>
              <span className="text-[10px] font-semibold text-primary leading-tight truncate">
                {course.duration || catalog?.duration || "N/A"}
              </span>
            </div>
          </div>

          {/* Timings */}
          {course.timings && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Timings</span>
                <span className="text-[10px] font-semibold text-primary leading-tight truncate">{course.timings}</span>
              </div>
            </div>
          )}

          {/* Days */}
          {course.days && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Days</span>
                <span className="text-[10px] font-semibold text-primary leading-tight truncate">{course.days}</span>
              </div>
            </div>
          )}

          {/* Language */}
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Language</span>
              <span className="text-[10px] font-semibold text-primary leading-tight truncate">{course.language}</span>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
              {course.mode.toLowerCase() === "online" ? (
                <Globe className="w-3.5 h-3.5 text-primary" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Mode</span>
              <span className="text-[10px] font-semibold text-primary leading-tight truncate">{course.mode}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between pt-6 border-t border-primary/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Course Fee</span>
            <div className="flex items-baseline gap-0.5 text-primary">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-2xl font-bold">{course.fee > 0 ? Number(course.fee).toLocaleString() : "Free"}</span>
            </div>
          </div>
          
          <Button 
            variant={isRegistrationOpen ? "default" : "secondary"} 
            size="lg"
            onClick={() => onRegister(course)}
            disabled={!isRegistrationOpen}
            className={`w-full sm:w-auto rounded-2xl px-6 sm:px-8 font-bold transition-all duration-300 ${
              isRegistrationOpen 
                ? "bg-primary hover:bg-black hover:scale-105 shadow-lg hover:shadow-primary/20"
                : "opacity-60 cursor-not-allowed bg-secondary text-muted-foreground"
            }`}
          >
            {isRegistrationOpen ? "Register Now" : "Coming Soon"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
