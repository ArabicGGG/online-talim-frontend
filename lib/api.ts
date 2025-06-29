import { API_BASE_URL, isDevelopment } from "./config"

// API client with credentials support
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    if (isDevelopment) {
      console.log(`API Request: ${options.method || "GET"} ${url}`)
    }

    const config: RequestInit = {
      credentials: "include", // Important for session cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Check if response is HTML (error page)
      const contentType = response.headers.get("content-type")
      const isHtml = contentType && (contentType.includes("text/html") || contentType.includes("text/plain"))

      if (isHtml) {
        if (response.status === 404) {
          throw new Error("API endpoint not found")
        } else if (response.status >= 500) {
          throw new Error("Server error occurred")
        } else if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication required")
        } else {
          throw new Error(`Server returned HTML instead of JSON (Status: ${response.status})`)
        }
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const text = await response.text()
      if (!text) {
        return {} as T
      }

      try {
        return JSON.parse(text)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", text)
        throw new Error("Invalid JSON response from server")
      }
    } catch (error) {
      console.error("API request failed:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to server")
      }

      throw error
    }
  }

  // Authentication
  async register(userData: {
    name: string
    email: string
    password: string
    role: string
  }) {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout() {
    return this.request("/logout", {
      method: "POST",
    })
  }

  async getCurrentUser() {
    return this.request("/api/user/current")
  }

  // Profile
  async getProfile() {
    return this.request("/api/profile")
  }

  async updateProfile(profileData: any) {
    return this.request("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append("avatar", file)

    return this.request("/api/upload/avatar", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  // Courses
  async getCourses(params?: { search?: string; category?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.category) searchParams.append("category", params.category)

    const query = searchParams.toString()
    return this.request(`/api/courses${query ? `?${query}` : ""}`)
  }

  async getCourse(courseId: number) {
    return this.request(`/api/courses/${courseId}`)
  }

  // Comments
  async getCourseComments(courseId: number) {
    return this.request(`/api/courses/${courseId}/comments`)
  }

  async addCourseComment(courseId: number, comment: string) {
    return this.request(`/api/courses/${courseId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    })
  }

  // Ratings
  async getCourseRatings(courseId: number) {
    return this.request(`/api/courses/${courseId}/ratings`)
  }

  async addCourseRating(courseId: number, rating: number) {
    return this.request(`/api/courses/${courseId}/ratings`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    })
  }

  // Cart
  async getCart() {
    return this.request("/api/cart")
  }

  async addToCart(courseId: number) {
    return this.request("/api/cart", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    })
  }

  async removeFromCart(courseId: number) {
    return this.request("/api/cart", {
      method: "DELETE",
      body: JSON.stringify({ course_id: courseId }),
    })
  }

  async checkout() {
    return this.request("/api/cart/checkout", {
      method: "POST",
    })
  }

  async getCartCount() {
    return this.request("/api/cart/count")
  }

  // Instructor
  async createCourse(courseData: any) {
    return this.request("/instructor/courses/new", {
      method: "POST",
      body: JSON.stringify(courseData),
    })
  }

  async uploadVideo(file: File) {
    const formData = new FormData()
    formData.append("video", file)

    return this.request("/api/upload/video", {
      method: "POST",
      headers: {},
      body: formData,
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
