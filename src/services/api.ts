import axios from "axios";
import type {
  Course,
  Instructor,
  ApiResponse,
} from "@/types";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!this.baseURL) {
      console.warn("VITE_API_BASE_URL environment variable is regulated for Google Apps Script integration");
    }
  }

  private async fetchFromGas<T>(action: string): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get(`${this.baseURL}?action=${action}`);
      return {
        data: response.data.data,
        success: true
      };
    } catch (error) {
      console.error(`Error fetching ${action}:`, error);
      return {
        data: [] as any,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Course endpoints
  async getCourses(status?: "ongoing" | "upcoming"): Promise<ApiResponse<Course[]>> {
    const response = await this.fetchFromGas<Course[]>("getCourses");
    if (status && response.success) {
      return {
        ...response,
        data: response.data.filter(c => c.status === status)
      };
    }
    return response;
  }


  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    const response = await this.getCourses();
    const course = response.data.find(c => c.id === id);
    return {
      data: course as Course,
      success: !!course
    };
  }

  // Instructor endpoints
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    return this.fetchFromGas<Instructor[]>("getInstructors");
  }

  async getInstructorById(id: number): Promise<ApiResponse<Instructor>> {
    const response = await this.getInstructors();
    const instructor = response.data.find(i => i.id === id);
    return {
      data: instructor as Instructor,
      success: !!instructor
    };
  }
}

export const apiClient = new ApiClient();
