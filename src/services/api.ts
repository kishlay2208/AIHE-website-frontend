import axios from "axios";
import { transformDriveUrl } from "@/lib/utils";
import type {
  Course,
  CourseCatalog,
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

  private cache: {
    instructors: Instructor[] | null;
    courses: Course[] | null;
    catalog: CourseCatalog[] | null;
    lastFetched: number;
  } = {
    instructors: null,
    courses: null,
    catalog: null,
    lastFetched: 0
  };

  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async fetchFromGas<T>(action: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL.trim()}?action=${action}`;
      const response = await axios.get(url);
      
      // Google Apps Script sometimes returns { data: [...] } and sometimes [...]
      // depending on how the doGet() is implemented in the script.
      const responseData = response.data.data !== undefined ? response.data.data : response.data;
      
      return {
        data: responseData,
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

  async getAllData(): Promise<boolean> {
    const now = Date.now();
    if (this.cache.lastFetched && (now - this.cache.lastFetched < this.CACHE_DURATION)) {
      return true;
    }

    console.log("Fetching all data from GAS...");
    const response = await this.fetchFromGas<{
      instructors: Instructor[],
      courses: Course[],
      catalog: CourseCatalog[]
    }>("getAllData");

    if (response.success && response.data) {
      // Normalize data keys just in case (e.g. Instructors vs instructors)
      const data = response.data as any;
      const instructors = data.instructors || data.Instructors || [];
      const courses = data.courses || data.Courses || [];
      const catalog = data.catalog || data.Catalog || [];
      
      console.log("Data fetched successfully:", { 
        instructorsCount: instructors.length, 
        coursesCount: courses.length, 
        catalogCount: catalog.length 
      });

      this.cache = {
        instructors: instructors.map((i: any) => ({
          ...i,
          id: i.id || i.ID || i.instructor_id || i.InstructorID,
          name: i.name || i.Name || i.FullName || i.Full_Name,
          title: i.title || i.Title || i.Designation,
          image: transformDriveUrl(i.image || i.Image || i.image_url || i.Photo || i.Picture || i.ProfilePhoto) || "",
          teaches: typeof i.teaches === 'string' 
            ? i.teaches.split(',').map((s: string) => s.trim())
            : Array.isArray(i.teaches) ? i.teaches : []
        })),
        catalog: catalog.map((c: any) => ({
          ...c,
          courseId: c.courseId || c.course_id || c.CourseID || c.courseid || "",
          name: c.name || c.Name || c.title || c.Title || c.CourseName || "",
          mode: c.mode || c.Mode || "Online",
          thumbnail: transformDriveUrl(c.thumbnail || c.Thumbnail || c.image || c.Image || c.Photo || c.Picture) || ""
        })),
        courses: courses.map((batch: any) => ({
          ...batch,
          batchId: batch.batchId || batch.batch_id || batch.BatchID || batch.id || batch.ID || `batch-${batch.courseId || batch.course_id || batch.courseid}-${batch.startDate || batch.start_date || batch.startdate}`,
          courseId: batch.courseId || batch.course_id || batch.CourseID || batch.courseid || "",
          startDate: batch.startDate || batch.start_date || batch.StartDate || batch.startdate || "",
          endDate: batch.endDate || batch.end_date || batch.EndDate || batch.enddate || "",
          instructorId: batch.instructorId || batch.instructor_id || batch.InstructorID || batch.instructorid || "",
          fee: Number(batch.fee || batch.Fee || 0),
          currency: "INR",
          language: batch.language || batch.Language || "Hindi",
          mode: batch.mode || batch.Mode || "Online",
          timings: batch.timings || batch.Timings || batch.timing || batch.Timing || "",
          days: batch.days || batch.Days || "",
          duration: batch.duration || batch.Duration || "",
          thumbnail: transformDriveUrl(batch.thumbnail || batch.Thumbnail || batch.course_thumbnail_image || batch.image || batch.Image || batch.courseThumbnailImage) || "",
          registrationFormUrl: batch.registrationFormUrl || batch.registration_form_url || batch.RegistrationFormUrl || batch.registrationformurl || ""
        })),
        lastFetched: now
      };
      return true;
    }
    
    console.error("Failed to fetch data from GAS:", response.message);
    
    // Safety fallback: if getAllData fails, ensure we don't crash but mark as not fetched
    if (this.cache.lastFetched === 0) {
      this.cache = { ...this.cache, instructors: [], courses: [], catalog: [], lastFetched: now };
    }
    return false;
  }

  // Course catalog endpoints
  async getCourseCatalog(): Promise<ApiResponse<CourseCatalog[]>> {
    if (!this.cache.catalog) {
      await this.getAllData();
    }
    return {
      data: this.cache.catalog || [],
      success: !!this.cache.catalog
    };
  }

  // Course (Batch) endpoints
  async getCourses(): Promise<ApiResponse<Course[]>> {
    if (!this.cache.courses || !this.cache.catalog) {
      await this.getAllData();
    }

    const catalogMap = new Map(this.cache.catalog?.map(c => [c.courseId, c]) || []);
    
    const mappedData = (this.cache.courses || []).map(batch => {
      const catalog = catalogMap.get(batch.courseId);
      return {
        ...batch,
        catalog: catalog,
      };
    });

    return { data: mappedData, success: true };
  }


  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    const response = await this.getCourses();
    const course = response.data.find(c => String(c.batchId) === String(id));
    return {
      data: course as Course,
      success: !!course
    };
  }

  // Instructor endpoints
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    if (!this.cache.instructors) {
      await this.getAllData();
    }
    return {
      data: this.cache.instructors || [],
      success: !!this.cache.instructors
    };
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
