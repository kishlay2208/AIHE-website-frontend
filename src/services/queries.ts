import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api";

// Course queries
export const useCourseCatalog = () => {
  return useQuery({
    queryKey: ["courseCatalog"],
    queryFn: () => apiClient.getCourseCatalog(),
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => apiClient.getCourses(),
  });
};


export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => apiClient.getCourseById(id),
    enabled: !!id,
  });
};

// Instructor queries
export const useInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: () => apiClient.getInstructors(),
  });
};

export const useInstructor = (id: number) => {
  return useQuery({
    queryKey: ["instructor", id],
    queryFn: () => apiClient.getInstructorById(id),
    enabled: !!id,
  });
};

// Testimonial queries
export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => apiClient.getTestimonials(),
  });
};

// Result queries
export const useResults = () => {
  return useQuery({
    queryKey: ["results"],
    queryFn: () => apiClient.getResults(),
  });
};


