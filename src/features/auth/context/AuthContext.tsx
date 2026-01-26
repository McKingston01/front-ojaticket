/**
 * ============================================================
 * @file        AuthContext.tsx
 * @description Context global de autenticación con refresh token
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-25
 * @version     2.3.0 - Alineado 100% con backend DTOs
 * ============================================================
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

import { apiClient } from '../../../shared/lib/api-client'
import { API_ENDPOINTS, STORAGE_KEYS } from '../../../shared/config/api.config'
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../../shared/types'
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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /**
   * Carga el usuario desde localStorage y valida con backend
   */
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

      if (!token) {
        setIsLoading(false)
        return
      }

      apiClient.setAuthToken(token)

      const userData = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
      setUser(userData)
    } catch {
      // Token inválido o expirado, limpiar todo
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      apiClient.clearAuthToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Cargar usuario al montar el provider
   */
  useEffect(() => {
    void loadUser()
  }, [loadUser])

  /**
   * Redirección según rol
   */
  const redirectByRole = useCallback(
    (role: User['role']) => {
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
    },
    [router]
  )

  /**
   * Maneja autenticación exitosa
   */
  const handleAuthSuccess = useCallback(
    (response: AuthResponse) => {
      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))

      // Configurar API client
      apiClient.setAuthToken(response.accessToken)

      // Actualizar estado
      setUser(response.user)

      // Redirigir según rol
      redirectByRole(response.user.role)
    },
    [redirectByRole]
  )

  /**
   * Manejo centralizado de errores de autenticación
   */
  const handleAuthError = useCallback(
    (error: unknown) => {
      if (error instanceof HttpError) {
        // Caso especial: Onboarding requerido para staff
        if (error.statusCode === 409) {
          router.push('/dashboard/staff/onboarding')
          return
        }
      }
      // Re-lanzar el error para que el componente lo maneje
      throw error
    },
    [router]
  )

  /**
   * Login con email/password
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
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
    },
    [handleAuthSuccess, handleAuthError]
  )

  /**
   * Registro de usuario
   * 
   * ✅ CORREGIDO v2.3.0:
   * - Ya NO necesita adaptación de campos
   * - RegisterRequest ya está alineado con backend
   * - Se envía directo sin transformaciones
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await apiClient.post<AuthResponse>(
          API_ENDPOINTS.AUTH.REGISTER,
          data, // ✅ Se envía directo, ya está alineado
          { skipAuth: true }
        )

        handleAuthSuccess(response)
      } catch (error) {
        handleAuthError(error)
      }
    },
    [handleAuthSuccess, handleAuthError]
  )

  /**
   * Login con Google OAuth
   */
  const loginWithGoogle = useCallback(
    async (idToken: string) => {
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
    },
    [handleAuthSuccess, handleAuthError]
  )

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      // Intentar notificar al backend
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Ignorar errores de logout del backend
      console.error('Logout error:', error)
    } finally {
      // Siempre limpiar el estado local
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      apiClient.clearAuthToken()
      setUser(null)
      router.push('/')
    }
  }, [router])

  /**
   * Refrescar usuario desde backend
   * Útil después de actualizar el perfil
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
      setUser(userData)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    } catch (error) {
      console.error('Refresh user error:', error)
      // Si falla, podría ser que el token expiró
      // El interceptor de API debería manejar esto
    }
  }, [])

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

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}