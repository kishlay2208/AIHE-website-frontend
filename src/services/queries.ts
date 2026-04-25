import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./api";

// Course queries
export const useCourses = (status?: "ongoing" | "upcoming") => {
  return useQuery({
    queryKey: ["courses", status],
    queryFn: () => apiClient.getCourses(status),
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
