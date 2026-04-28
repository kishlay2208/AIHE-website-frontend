import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useInstructors } from "@/services/queries";
import type { Instructor } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const InstructorCard = ({ instructor, index, isInView, onClick }: { 
  instructor: Instructor; 
  index: number; 
  isInView: boolean; 
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="bg-card rounded-2xl p-6 text-center group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-border/40 flex flex-col items-center h-full"
    onClick={onClick}
  >
    <div className="relative mb-5">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-primary/10 group-hover:border-accent transition-colors duration-500 shadow-inner">
        {instructor.image && instructor.image !== "/placeholder.svg" ? (
          <img 
            src={instructor.image} 
            alt={instructor.name}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-serif text-3xl font-bold">
            {instructor.name.split(" ").slice(-2).map(n => n[0]).join("")}
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-card flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
    
    <h3 className="font-serif text-base md:text-lg font-bold text-primary mb-1 tracking-tight group-hover:text-accent transition-colors duration-300">
      {instructor.name}
    </h3>
    <p className="text-muted-foreground text-[11px] md:text-xs uppercase tracking-widest font-medium mb-3">
      {instructor.title}
    </p>
    
    <div className="mt-auto pt-3 w-full border-t border-border/40">
      <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest group-hover:text-primary transition-colors">
        View Profile
      </span>
    </div>
  </motion.div>
);

const Instructors = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const { data: instructorsData, isLoading } = useInstructors();
  
  const instructors = instructorsData?.data || [];
  const fullTimeInstructors = instructors.filter(i => i.category === "Full-Time Instructor");
  const guestSpeakers = instructors.filter(i => i.category === "Guest Speaker");

  const renderSection = (title: string, list: Instructor[]) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-24 last:mb-0">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent to-primary/20" />
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary italic px-4">
            {title}
          </h3>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent to-primary/20" />
        </div>
        
        <div className="px-4 md:px-12 relative">
          <Carousel
            opts={{
              align: "start",
              loop: list.length > 5,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {list.map((instructor, index) => (
                <CarouselItem key={instructor.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <InstructorCard 
                    instructor={instructor} 
                    index={index} 
                    isInView={isInView} 
                    onClick={() => setSelectedInstructor(instructor)} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-6 lg:-left-12 border-primary/20 hover:bg-primary hover:text-white transition-all" />
              <CarouselNext className="-right-6 lg:-right-12 border-primary/20 hover:bg-primary hover:text-white transition-all" />
            </div>
          </Carousel>
        </div>
      </div>
    );
  };

  return (
    <section id="instructors" className="section-padding bg-[#FDFCF9]" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary font-bold tracking-[0.2em] uppercase text-[10px] mb-4 border border-primary/10">
            Our Faculty
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-2 mb-6">
            Expert Instructors
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8 rounded-full" />
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Learn from realized practitioners who distill decades of study and service 
            into structured, accessible wisdom for the modern age.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-accent rounded-full animate-spin" />
            <p className="text-primary/60 font-medium animate-pulse">Loading Faculty...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {renderSection("Full-Time Faculty", fullTimeInstructors)}
            {renderSection("Guest Speakers", guestSpeakers)}
            {instructors.length === 0 && (
              <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/60">
                <p className="text-muted-foreground italic">No instructors available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructor Modal */}
      <Dialog open={!!selectedInstructor} onOpenChange={() => setSelectedInstructor(null)}>
        <DialogContent className="sm:max-w-md bg-card">
          {selectedInstructor && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
                    {selectedInstructor.image && selectedInstructor.image !== "/placeholder.svg" ? (
                      <img 
                        src={selectedInstructor.image} 
                        alt={selectedInstructor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-violet-dark flex items-center justify-center text-primary-foreground font-serif text-xl font-bold">
                        {selectedInstructor.name.split(" ").slice(-2).map(n => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="font-serif text-xl text-primary">
                      {selectedInstructor.name}
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">{selectedInstructor.title}</p>
                    <Badge variant="outline" className="mt-1 border-primary/30 text-primary/70 text-[10px] uppercase tracking-wider">
                      {selectedInstructor.category}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">About</h4>
                  <p className="text-muted-foreground text-sm">{selectedInstructor.bio}</p>
                </div>
                {selectedInstructor.teaches && selectedInstructor.teaches.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Teaches</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstructor.teaches.map((course) => (
                        <Badge key={course} variant="secondary" className="bg-primary/10 text-primary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Instructors;
