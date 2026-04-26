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
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose from our carefully designed courses that guide you through the
            essential scriptures and practices of Bhakti Yoga.
          </p>

          {/* Inspirational Verse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 mb-10 max-w-4xl mx-auto"
          >
            <div className="bg-[#faf8f3] rounded-3xl p-8 md:p-14 border-2 border-primary/10 relative shadow-sm overflow-hidden group">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary/5 rounded-tl-3xl transition-all duration-500 group-hover:w-24 group-hover:h-24 group-hover:border-primary/20" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary/5 rounded-br-3xl transition-all duration-500 group-hover:w-24 group-hover:h-24 group-hover:border-primary/20" />
              
              <p className="font-serif text-2xl md:text-3xl text-primary font-bold mb-4 text-center leading-relaxed drop-shadow-sm">
                तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया ।
                <br />
                उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः ॥ ३४ ॥
              </p>
              <p className="font-serif italic text-foreground/50 text-sm sm:text-base md:text-lg mb-6 text-center whitespace-pre-line leading-relaxed">
                tad viddhi praṇipātena paripraśnena sevayā
                <br />
                upadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ
              </p>
              <div className="h-px w-24 bg-primary/10 mx-auto mb-6" />
              <p className="text-muted-foreground text-base md:text-lg text-center max-w-2xl mx-auto italic leading-relaxed">
                &ldquo;Just try to learn the truth by approaching a spiritual master. Inquire from him submissively and render service unto him.&rdquo;
                <span className="block mt-4 font-sans font-bold text-primary not-italic tracking-[0.2em] text-[10px] sm:text-xs uppercase">
                  &mdash; Bhagavad-gītā 4.34
                </span>
              </p>
            </div>
          </motion.div>
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
