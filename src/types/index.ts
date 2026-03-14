export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate?: string;
  instructor: string;
  language: string;
  mode: string;
  duration: string;
  sessions?: number;
  sessionsPerWeek?: number;
  timing?: string;
  videos?: number;
  eligibility: string;
  fee: number;
  currency: string;
  type: "idc" | "bhakti-shastri" | "bhakti-vaibhav";
  status: "ongoing" | "upcoming";
}

export interface Instructor {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
  fullBio: string;
  teaches: string[];
  tier: "senior" | "instructor";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin" | "superadmin";
}

export interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  status: "active" | "completed" | "pending";
  startDate: string;
  instructor: string;
  nextSession?: string;
}

export interface Recording {
  id: number;
  course_id?: number;
  session_number: number;
  session_date: string | null;
  topic: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  ppt_url: string | null;
}

export interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  material_type: string;
  url: string | null;
  description: string | null;
}

export interface Assessment {
  id: string;
  unit: string;
  cbaMarks: number;
  obaMarks: number;
  slokaMarks: number;
  total: number;
  maxMarks: number;
  status: "completed" | "pending";
}

export interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  status: "available" | "pending";
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

export interface Donation {
  id: string;
  date: string;
  amount: number;
  purpose: string;
  receipt?: string;
}

export interface StudentApproval {
  id: string;
  name: string;
  email: string;
  course: string;
  appliedDate: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  sessionsAttended: number;
  totalSessions: number;
  lastAttended: string;
}

export interface GradebookEntry {
  studentId: string;
  studentName: string;
  course: string;
  cba: number;
  oba: number;
  sloka: number;
  total: number;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "inactive";
  joinedDate: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
