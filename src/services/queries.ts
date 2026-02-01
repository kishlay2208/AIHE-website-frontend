import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import type { Course, Instructor } from "@/types";

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

export const useRegisterCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      apiClient.registerForCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
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

// Student queries
export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => apiClient.getEnrolledCourses(),
  });
};

export const useCourseRecordings = (courseId: string) => {
  return useQuery({
    queryKey: ["recordings", courseId],
    queryFn: () => apiClient.getCourseRecordings(courseId),
    enabled: !!courseId,
  });
};

export const useCourseAssessments = (courseId: string) => {
  return useQuery({
    queryKey: ["assessments", courseId],
    queryFn: () => apiClient.getCourseAssessments(courseId),
    enabled: !!courseId,
  });
};

export const useCertificates = () => {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: () => apiClient.getCertificates(),
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiClient.getTransactions(),
  });
};

export const useDonations = () => {
  return useQuery({
    queryKey: ["donations"],
    queryFn: () => apiClient.getDonations(),
  });
};

// Admin queries
export const useStudentApprovals = () => {
  return useQuery({
    queryKey: ["student-approvals"],
    queryFn: () => apiClient.getStudentApprovals(),
  });
};

export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      apiClient.updateApprovalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-approvals"] });
    },
  });
};

export const useAttendanceRecords = (courseId?: string) => {
  return useQuery({
    queryKey: ["attendance", courseId],
    queryFn: () => apiClient.getAttendanceRecords(courseId),
  });
};

export const useGradebook = (courseId?: string) => {
  return useQuery({
    queryKey: ["gradebook", courseId],
    queryFn: () => apiClient.getGradebook(courseId),
  });
};

export const useSystemUsers = () => {
  return useQuery({
    queryKey: ["system-users"],
    queryFn: () => apiClient.getSystemUsers(),
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Course>) => apiClient.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      apiClient.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
