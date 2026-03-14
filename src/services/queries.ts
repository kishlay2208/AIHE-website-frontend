import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import type { Course } from "@/types";

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

export const useCreateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.createInstructor>[0]) =>
      apiClient.createInstructor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
  });
};

export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof apiClient.updateInstructor>[1] }) =>
      apiClient.updateInstructor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
  });
};

export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
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

export const useCourseMaterials = (courseId: string) => {
  return useQuery({
    queryKey: ["materials", courseId],
    queryFn: () => apiClient.getCourseMaterials(courseId),
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

export const useUploadObaDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, unit, file }: { courseId: string; unit: string; file: File }) =>
      apiClient.uploadObaDocument(courseId, unit, file),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["assessments", courseId] });
    },
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

export const useDonationCauses = () => {
  return useQuery({
    queryKey: ["donation-causes"],
    queryFn: () => apiClient.getDonationCauses(),
  });
};

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => apiClient.getAnnouncements(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof apiClient.updateProfile>[0]) =>
      apiClient.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { role?: string; is_active?: boolean } }) =>
      apiClient.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-users"] });
    },
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
