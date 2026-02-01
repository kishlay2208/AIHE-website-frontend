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

const Instructors = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const { data: instructorsData, isLoading } = useInstructors();
  const instructors = instructorsData?.data || [];

  return (
    <section id="instructors" className="section-padding bg-lavender" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            Our Faculty
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-4 mb-6">
            Expert Instructors
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn from experienced devotees who have dedicated their lives to the
            study and practice of Vedic wisdom.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">Loading instructors...</div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No instructors available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card rounded-xl p-4 text-center group cursor-pointer hover-lift shadow-md card-violet-border"
              onClick={() => setSelectedInstructor(instructor)}
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto border-4 border-primary/20 group-hover:border-primary transition-colors duration-300">
                  {instructor.image !== "/placeholder.svg" ? (
                    <img 
                      src={instructor.image} 
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-violet-dark flex items-center justify-center text-primary-foreground font-serif text-2xl font-bold">
                      {instructor.name.split(" ").slice(-2).map(n => n[0]).join("")}
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <h3 className="font-serif text-sm md:text-base font-semibold text-foreground mb-1 leading-tight">
                {instructor.name}
              </h3>
              <p className="text-muted-foreground text-xs">{instructor.title}</p>
              <p className="text-primary text-xs mt-2 font-medium">Click for details</p>
            </motion.div>
            ))}
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
                    {selectedInstructor.image !== "/placeholder.svg" ? (
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
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">About</h4>
                  <p className="text-muted-foreground text-sm">{selectedInstructor.bio}</p>
                </div>
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Instructors;
