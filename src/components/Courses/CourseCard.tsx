import { motion } from "framer-motion";
import { Calendar, Clock, User, Globe, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  index: number;
  onRegister: (course: Course) => void;
}

const CourseCard = ({ course, index, onRegister }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-xl overflow-hidden hover-lift group shadow-lg border border-border card-violet-border"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          course.status === "ongoing" 
            ? "bg-green-100 text-green-700" 
            : "bg-accent/20 text-accent"
        }`}>
          {course.status === "ongoing" ? "Ongoing" : "Upcoming"}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-xl font-bold text-white mb-1">
            {course.title}
          </h3>
          <p className="text-white/80 text-sm">{course.subtitle}</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{course.startDate}{course.endDate ? ` - ${course.endDate}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <User className="w-4 h-4 text-primary" />
            <span>{course.instructor}</span>
          </div>
          {course.timing && (
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Clock className="w-4 h-4 text-primary" />
              <span>{course.duration} | {course.timing}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Globe className="w-4 h-4 text-primary" />
            <span>{course.language} • {course.mode}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-foreground">
            <IndianRupee className="w-5 h-5" />
            <span className="text-2xl font-bold">{course.fee.toLocaleString()}</span>
          </div>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onRegister(course)}
          >
            Register Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
