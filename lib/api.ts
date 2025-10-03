const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshToken()
      // Retry the request
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`
        return fetch(url, { ...options, headers })
      }
    }

    return response
  }

  private async refreshToken() {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
    if (!refreshToken) return

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.setToken(data.access)
      } else {
        this.clearToken()
      }
    } catch (error) {
      this.clearToken()
    }
  }

  // Auth methods
  async login(identifier: string, password: string) {
    // Backend supports email or username in either field
    const response = await this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username: identifier, email: identifier, password }),
    })
    return response.json()
  }

  async register(userData: any) {
    // Normalize userType camelCase to snake_case expected by DRF
    const normalized = {
      ...userData,
      user_type: userData.userType ?? userData.user_type,
    }
    delete (normalized as any).userType
    const response = await this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(normalized),
    })
    return response.json()
  }

  async getMe() {
    const response = await this.request("/auth/me/")
    return response.json()
  }

  async getSubscription() {
    const response = await this.request("/auth/subscription/")
    return response.json()
  }

  // Projects methods
  async getProjects(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    const response = await this.request(`/projects/?${queryString}`)
    return response.json()
  }

  async getProject(id: number) {
    const response = await this.request(`/projects/${id}/`)
    return response.json()
  }

  async createProject(projectData: any) {
    const response = await this.request("/projects/", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
    return response.json()
  }

  async updateProject(id: number, projectData: any) {
    const response = await this.request(`/projects/${id}/`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    })
    return response.json()
  }

  async deleteProject(id: number) {
    const response = await this.request(`/projects/${id}/`, {
      method: "DELETE",
    })
    return response.ok
  }

  async getMyProjects() {
    const response = await this.request("/projects/my-projects/")
    return response.json()
  }

  // Services methods
  async getServices(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    const response = await this.request(`/services/?${queryString}`)
    return response.json()
  }

  async getService(id: number) {
    const response = await this.request(`/services/${id}/`)
    return response.json()
  }

  async getFeaturedServices() {
    const response = await this.request("/services/featured/")
    return response.json()
  }

  // Payments methods
  async createPaymentIntent(paymentData: any) {
    const response = await this.request("/payments/create-payment-intent/", {
      method: "POST",
      body: JSON.stringify(paymentData),
    })
    return response.json()
  }

  async getPaymentHistory() {
    const response = await this.request("/payments/history/")
    return response.json()
  }

  async getWalletInfo() {
    const response = await this.request("/payments/wallet/")
    return response.json()
  }

  // Notifications methods
  async getNotifications() {
    const response = await this.request("/notifications/")
    return response.json()
  }

  async markNotificationAsRead(id: number) {
    const response = await this.request(`/notifications/${id}/read/`, {
      method: "POST",
    })
    return response.json()
  }

  async getUnreadCount() {
    const response = await this.request("/notifications/unread-count/")
    return response.json()
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
