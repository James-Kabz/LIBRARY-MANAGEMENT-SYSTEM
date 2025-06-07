import axios from "axios"
import toast from "react-hot-toast"
import { useAuthStore } from "../stores/authStore"

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        // Show success message for non-GET requests
        if (response.config.method !== "get" && response.data?.message) {
          toast.success(response.data.message)
        }
        return response
      },
      (error) => {
        this.handleError(error)
        return Promise.reject(error)
      },
    )
  }

  handleError(error) {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      useAuthStore.getState().logout()
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action.")
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.")
    } else if (error.response?.status === 422) {
      // Validation errors
      const errors = error.response.data?.errors
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((message) => {
            toast.error(message)
          })
      } else {
        toast.error(error.response.data?.message || "Validation failed.")
      }
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    } else if (error.code === "NETWORK_ERROR") {
      toast.error("Network error. Please check your connection.")
    } else {
      toast.error(error.response?.data?.message || "An error occurred.")
    }
  }

  // Generic methods
  async get(url, params) {
    const response = await this.api.get(url, { params })
    return response.data
  }

  async post(url, data) {
    const response = await this.api.post(url, data)
    return response.data
  }

  async put(url, data) {
    const response = await this.api.put(url, data)
    return response.data
  }

  async patch(url, data) {
    const response = await this.api.patch(url, data)
    return response.data
  }

  async delete(url) {
    const response = await this.api.delete(url)
    return response.data
  }
}

export const apiService = new ApiService()
