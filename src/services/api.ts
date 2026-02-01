import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  Course,
  Instructor,
  EnrolledCourse,
  Recording,
  Assessment,
  Certificate,
  Transaction,
  Donation,
  StudentApproval,
  AttendanceRecord,
  GradebookEntry,
  SystemUser,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!baseURL) {
      throw new Error("VITE_API_BASE_URL environment variable is required");
    }
    
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ access_token: string; token_type: string; user: any }>> {
    const response = await this.client.post("/auth/login", { email, password });
    return response.data;
  }

  async register(data: { name: string; email: string; password: string }): Promise<ApiResponse<{ access_token: string; token_type: string; user: any }>> {
    const response = await this.client.post("/auth/register", data);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    const response = await this.client.get("/auth/me");
    return response.data;
  }

  async googleAuth(token: string): Promise<ApiResponse<{ access_token: string; token_type: string; user: any }>> {
    const response = await this.client.post("/auth/google", { token });
    return response.data;
  }

  // Course endpoints
  async getCourses(status?: "ongoing" | "upcoming"): Promise<ApiResponse<Course[]>> {
    const params = status ? { status } : {};
    const response = await this.client.get("/courses", { params });
    return response.data;
  }

  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    const response = await this.client.get(`/courses/${id}`);
    return response.data;
  }

  async registerForCourse(courseId: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.client.post(`/courses/${courseId}/register`, data);
    return response.data;
  }

  // Instructor endpoints
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    const response = await this.client.get("/instructors");
    return response.data;
  }

  async getInstructorById(id: number): Promise<ApiResponse<Instructor>> {
    const response = await this.client.get(`/instructors/${id}`);
    return response.data;
  }

  // Student/Dashboard endpoints
  async getEnrolledCourses(): Promise<ApiResponse<EnrolledCourse[]>> {
    const response = await this.client.get("/students/courses");
    return response.data;
  }

  async getCourseRecordings(courseId: string): Promise<ApiResponse<Recording[]>> {
    const response = await this.client.get(`/students/courses/${courseId}/recordings`);
    return response.data;
  }

  async getCourseAssessments(courseId: string): Promise<ApiResponse<Assessment[]>> {
    const response = await this.client.get(`/students/courses/${courseId}/assessments`);
    return response.data;
  }

  async getCertificates(): Promise<ApiResponse<Certificate[]>> {
    const response = await this.client.get("/students/certificates");
    return response.data;
  }

  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    const response = await this.client.get("/students/transactions");
    return response.data;
  }

  async getDonations(): Promise<ApiResponse<Donation[]>> {
    const response = await this.client.get("/students/donations");
    return response.data;
  }

  // Admin endpoints
  async getStudentApprovals(): Promise<ApiResponse<StudentApproval[]>> {
    const response = await this.client.get("/admin/approvals");
    return response.data;
  }

  async updateApprovalStatus(id: string, status: "approved" | "rejected"): Promise<ApiResponse<any>> {
    const response = await this.client.patch(`/admin/approvals/${id}`, { status });
    return response.data;
  }

  async getAttendanceRecords(courseId?: string): Promise<ApiResponse<AttendanceRecord[]>> {
    const params = courseId ? { courseId } : {};
    const response = await this.client.get("/admin/attendance", { params });
    return response.data;
  }

  async getGradebook(courseId?: string): Promise<ApiResponse<GradebookEntry[]>> {
    const params = courseId ? { courseId } : {};
    const response = await this.client.get("/admin/gradebook", { params });
    return response.data;
  }

  async getSystemUsers(): Promise<ApiResponse<SystemUser[]>> {
    const response = await this.client.get("/admin/users");
    return response.data;
  }

  async createCourse(data: Partial<Course>): Promise<ApiResponse<Course>> {
    const response = await this.client.post("/admin/courses", data);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
    const response = await this.client.patch(`/admin/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    const response = await this.client.delete(`/admin/courses/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
