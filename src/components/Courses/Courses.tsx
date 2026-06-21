import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCourses, useCourseCatalog } from "@/services/queries";
import CourseCard from "./CourseCard";
import CourseCatalogCard from "./CourseCatalogCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Course } from "@/types";
import { isCourseLive, isCourseUpcoming } from "@/lib/utils";

interface CoursesProps {
  onRegister: (course: Course) => void;
}

const Courses = ({ onRegister }: CoursesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: catalogData, isLoading: catalogLoading } = useCourseCatalog();
  const { data: coursesData, isLoading: coursesLoading } = useCourses();

  const catalogCourses = catalogData?.data || [];
  const allCourses = coursesData?.data || [];

  const liveCourses = allCourses.filter(course => {
    const status = String(course.status || "").toLowerCase().trim();
    if (status === "ongoing" || status === "live" || status === "active" || status === "running") return true;
    if (status === "upcoming" || status === "closed") return false;
    return isCourseLive(course.startDate, course.endDate);
  });
  const upcomingCourses = allCourses.filter(course => {
    const status = String(course.status || "").toLowerCase().trim();
    if (status === "upcoming") return true;
    if (status === "ongoing" || status === "live" || status === "active" || status === "closed") return false;
    return isCourseUpcoming(course.startDate);
  });

  return (
    <section id="courses" className="section-padding bg-card" ref={ref}>
      <div className="container mx-auto space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            AIHE Offerings
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-4 mb-6">
            Explore Our Programs
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Broaden your horizons with our systematic study of Vedic wisdom.
          </p>
        </motion.div>

        {/* 1. Upcoming Courses */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary text-center">
            Upcoming Courses
          </h3>
          <div className="h-0.5 w-16 bg-primary/10 mx-auto mb-8" />
          {coursesLoading ? (
            <div className="text-center py-12">Loading upcoming courses...</div>
          ) : upcomingCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white rounded-3xl p-8 border border-primary/5 shadow-sm max-w-lg mx-auto">
              No upcoming batches at the moment.
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: upcomingCourses.length > 2,
              }}
              className="w-full max-w-5xl mx-auto relative px-12"
            >
              <CarouselContent className="-ml-4">
                {upcomingCourses.map((course, index) => (
                  <CarouselItem key={course.batchId} className="pl-4 md:basis-1/2">
                    <div className="h-full py-4">
                      <CourseCard
                        course={course}
                        index={index}
                        onRegister={onRegister}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-4 bg-primary text-primary-foreground hover:bg-primary/90" />
                <CarouselNext className="-right-4 bg-primary text-primary-foreground hover:bg-primary/90" />
              </div>
            </Carousel>
          )}
        </div>

        {/* 2. Live Courses */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary text-center">
            Live Courses
          </h3>
          <div className="h-0.5 w-16 bg-primary/10 mx-auto mb-8" />
          {coursesLoading ? (
            <div className="text-center py-12">Loading live courses...</div>
          ) : liveCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white rounded-3xl p-8 border border-primary/5 shadow-sm max-w-lg mx-auto">
              No active live courses at the moment. Please check back soon or browse our upcoming courses.
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: liveCourses.length > 2,
              }}
              className="w-full max-w-5xl mx-auto relative px-12"
            >
              <CarouselContent className="-ml-4">
                {liveCourses.map((course, index) => (
                  <CarouselItem key={course.batchId} className="pl-4 md:basis-1/2">
                    <div className="h-full py-4">
                      <CourseCard
                        course={course}
                        index={index}
                        onRegister={onRegister}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-4 bg-primary text-primary-foreground hover:bg-primary/90" />
                <CarouselNext className="-right-4 bg-primary text-primary-foreground hover:bg-primary/90" />
              </div>
            </Carousel>
          )}
        </div>

        {/* 3. Course Catalog */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary text-center">
            Course Catalog
          </h3>
          <div className="h-0.5 w-16 bg-primary/10 mx-auto mb-8" />
          {catalogLoading ? (
            <div className="text-center py-12">Loading course catalog...</div>
          ) : catalogCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white rounded-3xl p-8 border border-primary/5 shadow-sm max-w-lg mx-auto">
              No courses in the catalog at the moment.
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: catalogCourses.length > 2,
              }}
              className="w-full max-w-5xl mx-auto relative px-12"
            >
              <CarouselContent className="-ml-4">
                {catalogCourses.map((catalog, index) => (
                  <CarouselItem key={catalog.courseId} className="pl-4 md:basis-1/2 lg:basis-1/2">
                    <div className="h-full py-4">
                      <CourseCatalogCard
                        catalog={catalog}
                        index={index}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-4 bg-primary text-primary-foreground hover:bg-primary/90" />
                <CarouselNext className="-right-4 bg-primary text-primary-foreground hover:bg-primary/90" />
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;
