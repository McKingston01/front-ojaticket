/**
 * ============================================================
 * @file        layout.tsx
 * @description Layout para páginas de autenticación
 * @author      Matías Carrión
 * @created     2025-01-08
 * @version     1.0.0
 * ============================================================
 */

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>
}