/**
 * ============================================================
 * @file        api-client.ts
 * @description Cliente HTTP centralizado con interceptors y auto-refresh
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.0.0
 * ============================================================
 */

import { API_CONFIG, HTTP_STATUS, ERROR_CODES, STORAGE_KEYS } from '../config/api.config'
import { HttpError } from './http-error'

// ============================================================================
// REQUEST OPTIONS
// ============================================================================

interface RequestOptions extends RequestInit {
  timeout?: number
  skipAuth?: boolean
  retries?: number
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private defaultHeaders: Record<string, string>
  private isRefreshing: boolean = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.defaultTimeout = API_CONFIG.timeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  private setAccessToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  }

  private removeAccessToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * Refresca el access token usando el refresh token
   * @returns Nuevo access token o null si falla
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      return null
    }

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include', // Incluir credenciales para que las cookies se envíen
      })

      if (!response.ok) {
        this.removeAccessToken()
        return null
      }

      const data = await response.json()
      
      // Guardar nuevos tokens
      this.setAccessToken(data.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
      
      return data.accessToken
    } catch (error) {
      this.removeAccessToken()
      return null
    }
  }

  /**
   * Suscribe un callback para cuando el token se refresque
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback)
  }

  /**
   * Notifica a todos los suscriptores del nuevo token
   */
  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private buildHeaders(skipAuth: boolean = false): Record<string, string> {
    const headers: Record<string, string> = { ...this.defaultHeaders }

    if (!skipAuth) {
      const token = this.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Incluir credenciales en todas las solicitudes
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpError(
          'Request timeout',
          0,
          ERROR_CODES.TIMEOUT_ERROR
        )
      }
      throw error
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: { code?: string; message?: string; details?: unknown } = {}

    try {
      errorData = await response.json()
    } catch {
      // Si no se puede parsear JSON, usar mensaje por defecto
    }

    const message = errorData.message || response.statusText || 'Unknown error'
    const code = errorData.code || ERROR_CODES.UNKNOWN_ERROR
    const details = errorData.details

    throw new HttpError(message, response.status, code, details)
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      skipAuth = false,
      retries = 0,
      headers: customHeaders,
      ...fetchOptions
    } = options

    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.buildHeaders(skipAuth),
      ...customHeaders,
    }

    try {
      const response = await this.fetchWithTimeout(
        url,
        { ...fetchOptions, headers },
        timeout
      )

      // Handle 401 - Auto refresh token
      if (response.status === HTTP_STATUS.UNAUTHORIZED && !skipAuth) {
        if (!this.isRefreshing) {
          this.isRefreshing = true
          
          const newToken = await this.refreshAccessToken()
          
          if (newToken) {
            this.isRefreshing = false
            this.onTokenRefreshed(newToken)
            
            // Retry original request with new token
            const newHeaders = {
              ...this.buildHeaders(false),
              ...customHeaders,
            }
            
            const retryResponse = await this.fetchWithTimeout(
              url,
              { ...fetchOptions, headers: newHeaders },
              timeout
            )
            
            if (retryResponse.status === HTTP_STATUS.NO_CONTENT) {
              return undefined as T
            }
            
            if (!retryResponse.ok) {
              await this.handleErrorResponse(retryResponse)
            }
            
            const data = await retryResponse.json()
            return data as T
          } else {
            this.isRefreshing = false
            this.removeAccessToken()
            
            // Redirect to login (this will be handled by the auth context)
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            
            await this.handleErrorResponse(response)
          }
        } else {
          // Wait for token refresh
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh(async () => {
              const newHeaders = {
                ...this.buildHeaders(false),
                ...customHeaders,
              }
              
              try {
                const retryResponse = await this.fetchWithTimeout(
                  url,
                  { ...fetchOptions, headers: newHeaders },
                  timeout
                )
                
                if (retryResponse.status === HTTP_STATUS.NO_CONTENT) {
                  resolve(undefined as T)
                  return
                }
                
                if (!retryResponse.ok) {
                  await this.handleErrorResponse(retryResponse)
                }
                
                const data = await retryResponse.json()
                resolve(data as T)
              } catch (error) {
                reject(error)
              }
            })
          })
        }
      }

      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return undefined as T
      }

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof HttpError) {
        throw error
      }

      if (error instanceof TypeError) {
        throw new HttpError(
          'Network error',
          0,
          ERROR_CODES.NETWORK_ERROR,
          error
        )
      }

      throw new HttpError(
        'Unknown error',
        0,
        ERROR_CODES.UNKNOWN_ERROR,
        error
      )
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  setAuthToken(token: string): void {
    this.setAccessToken(token)
  }

  clearAuthToken(): void {
    this.removeAccessToken()
  }
}

export const apiClient = new ApiClient()