import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCourses } from "@/services/queries";
import CourseCard from "./CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Course } from "@/types";

interface CoursesProps {
  onRegister: (course: Course) => void;
}

const Courses = ({ onRegister }: CoursesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("ongoing");

  const { data: ongoingData, isLoading: ongoingLoading } = useCourses("ongoing");
  const { data: upcomingData, isLoading: upcomingLoading } = useCourses("upcoming");

  const ongoingCourses = ongoingData?.data || [];
  const upcomingCourses = upcomingData?.data || [];

  return (
    <section id="courses" className="section-padding bg-card" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-4 mb-6">
            Explore Our Courses
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our carefully designed courses that guide you through the
            essential scriptures and practices of Bhakti Yoga.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10 bg-secondary h-12">
            <TabsTrigger 
              value="ongoing" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-medium"
            >
              Ongoing Courses
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-medium"
            >
              Upcoming Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing">
            {ongoingLoading ? (
              <div className="text-center py-12">Loading courses...</div>
            ) : ongoingCourses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No ongoing courses at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {ongoingCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onRegister={onRegister}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingLoading ? (
              <div className="text-center py-12">Loading courses...</div>
            ) : upcomingCourses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No upcoming courses at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {upcomingCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    onRegister={onRegister}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Courses;
