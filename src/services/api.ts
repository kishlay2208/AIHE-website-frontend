import axios from "axios";
import { transformDriveUrl } from "@/lib/utils";
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
    if (response.success && response.data) {
      const mappedData = response.data.map(c => {
        // Clean up status: default to "upcoming" if empty or invalid
        let normalizedStatus = "upcoming";
        if (c.status && typeof c.status === 'string') {
          const s = c.status.toLowerCase().trim();
          if (s === 'ongoing' || s === 'upcoming') {
            normalizedStatus = s;
          }
        }

        return {
          ...c,
          thumbnail: transformDriveUrl(c.thumbnail) || "",
          status: normalizedStatus as "ongoing" | "upcoming"
        };
      });

      if (status) {
        return {
          ...response,
          data: mappedData.filter(c => c.status === status)
        };
      }
      return { ...response, data: mappedData };
    }
    return response;
  }


  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    const response = await this.getCourses();
    const course = response.data.find(c => String(c.id) === String(id));
    return {
      data: course as Course,
      success: !!course
    };
  }

  // Instructor endpoints
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    const response = await this.fetchFromGas<Instructor[]>("getInstructors");
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(i => ({
          ...i,
          image: transformDriveUrl(i.image) || "",
          // Ensure teaches is an array if it comes as a comma-separated string
          teaches: typeof i.teaches === 'string' 
            ? (i.teaches as string).split(',').map(s => s.trim())
            : Array.isArray(i.teaches) ? i.teaches : []
        }))
      };
    }
    return response;
  }

  async getInstructorById(id: number): Promise<ApiResponse<Instructor>> {
    const response = await this.getInstructors();
    const instructor = response.data.find(i => Number(i.id) === Number(id));
    return {
      data: instructor as Instructor,
      success: !!instructor
    };
  }
}

export const apiClient = new ApiClient();
