// API response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ApiError = {
  message: string
  status: number
  code?: string
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Request configuration
export type RequestConfig = {
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
}

// API endpoint configuration
export type ApiEndpoint = {
  url: string
  method: HttpMethod
  config?: RequestConfig
}
