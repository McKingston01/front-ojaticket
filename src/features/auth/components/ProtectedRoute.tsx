/**
 * ============================================================
 * @file        ProtectedRoute.tsx
 * @description Componente para proteger rutas por autenticación y rol
 * @author      Matías Carrión
 * @created     2025-01-08
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../../../shared/types'

// ============================================================================
// TYPES
// ============================================================================

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  requireAuth?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized')
      return
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requireAuth, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}