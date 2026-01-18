/**
 * ============================================================
 * @file        AuthContext.tsx
 * @description Context global de autenticación con refresh token
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.0.0
 * ============================================================
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { apiClient } from '../../../shared/lib/api-client'
import { API_ENDPOINTS, STORAGE_KEYS } from '../../../shared/config/api.config'
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../../../shared/types'
import { HttpError } from '../../../shared/lib/http-error'

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carga el usuario desde localStorage y verifica con backend
   */
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verificar token con backend
      const userData = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
      setUser(userData)
    } catch (error) {
      // Token inválido o expirado, limpiar
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Cargar usuario al montar el componente
   */
  useEffect(() => {
    loadUser()
  }, [loadUser])

  /**
   * Maneja la respuesta de autenticación exitosa
   */
  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    // Guardar tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

    // Configurar token en cliente API
    apiClient.setAuthToken(response.accessToken)

    // Actualizar estado
    setUser(response.user)

    // Redirigir según rol
    redirectByRole(response.user.role)
  }, [])

  /**
   * Maneja errores de autenticación
   */
  const handleAuthError = useCallback((error: unknown) => {
    if (error instanceof HttpError) {
      // Error 409 ONBOARDING_REQUIRED
      if (error.statusCode === 409) {
        router.push('/dashboard/staff/onboarding')
        return
      }
    }
    
    // Re-throw para que el componente maneje otros errores
    throw error
  }, [router])

  /**
   * Login de usuario
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        { skipAuth: true }
      )

      handleAuthSuccess(response)
    } catch (error) {
      handleAuthError(error)
    }
  }, [handleAuthSuccess, handleAuthError])

  /**
   * Registro de usuario
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
        { skipAuth: true }
      )

      handleAuthSuccess(response)
    } catch (error) {
      handleAuthError(error)
    }
  }, [handleAuthSuccess, handleAuthError])

  /**
   * Login con Google OAuth
   */
  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.GOOGLE,
        { idToken },
        { skipAuth: true }
      )

      handleAuthSuccess(response)
    } catch (error) {
      handleAuthError(error)
    }
  }, [handleAuthSuccess, handleAuthError])

  /**
   * Logout de usuario
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Continuar con logout local aunque falle backend
      console.error('Logout error:', error)
    } finally {
      // Limpiar estado local
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      apiClient.clearAuthToken()
      setUser(null)
      
      // Redirigir a home
      router.push('/')
    }
  }, [router])

  /**
   * Refrescar datos del usuario
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
      setUser(userData)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }, [])

  /**
   * Redirigir según rol del usuario
   */
  const redirectByRole = (role: User['role']) => {
    switch (role) {
      case 'customer':
        router.push('/dashboard/customer')
        break
      case 'producer':
        router.push('/dashboard/producer')
        break
      case 'staff':
        router.push('/dashboard/staff')
        break
      case 'dev':
        router.push('/dashboard/dev')
        break
      default:
        router.push('/')
    }
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}