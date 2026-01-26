/**
 * ============================================================
 * @file        AuthContext.tsx
 * @description Context global de autenticación con refresh token
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.2.0
 * ============================================================
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
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

/**
 * Payload que recibe el AuthContext desde el formulario de registro
 * (adaptador frontend → backend)
 */
interface RegisterFormPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  documentId: string
  country: 'CL' | 'AR'
  birthDate: string
  phone: string 
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterFormPayload) => Promise<void>
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
    loadUser()
  }, [loadUser])

  /**
   * Maneja autenticación exitosa
   */
  const handleAuthSuccess = useCallback(
    (response: AuthResponse) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(response.user)
      )

      apiClient.setAuthToken(response.accessToken)
      setUser(response.user)

      redirectByRole(response.user.role)
    },
    []
  )

  /**
   * Manejo centralizado de errores de autenticación
   */
  const handleAuthError = useCallback(
    (error: unknown) => {
      if (error instanceof HttpError) {
        // Onboarding requerido
        if (error.statusCode === 409) {
          router.push('/dashboard/staff/onboarding')
          return
        }
      }
      throw error
    },
    [router]
  )

  /**
   * Login
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
   * Adaptación explícita frontend → backend
   */
  const register = useCallback(
    async (data: RegisterFormPayload) => {
      try {
        const payload: RegisterRequest = {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,

          documentType: data.country === 'CL' ? 'RUT' : 'DNI',
          documentNumber: data.documentId,
          dateOfBirth: data.birthDate,

          country: data.country,
        }

        const response = await apiClient.post<AuthResponse>(
          API_ENDPOINTS.AUTH.REGISTER,
          payload,
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
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
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
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
      setUser(userData)
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(userData)
      )
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }, [])

  /**
   * Redirección según rol
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
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
