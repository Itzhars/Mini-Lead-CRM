import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

const baseURL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3001"

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})

// Request Interceptor: Inject auth tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("crm_auth_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  code?: string
}

// Response Interceptor: Clean API formatting & global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const customError: ApiErrorResponse = {
      message: "An unexpected error occurred. Please try again.",
    }

    if (error.response) {
      customError.message = error.response.data?.message || customError.message
      customError.errors = error.response.data?.errors
      customError.code = error.response.data?.code

      if (error.response.status === 401) {
        localStorage.removeItem("crm_auth_token")
        // Global handler could redirect or dispatch logout
      }
    } else if (error.request) {
      customError.message = "No response received from the server. Please check your internet connection."
    }

    return Promise.reject(customError)
  }
)
