/**
 * ============================================================
 * @file        layout.tsx
 * @description Layout raíz con Providers
 * @author      Matías Carrión
 * @created     2025-01-08
 * @updated     2025-01-16
 * @version     2.0.0
 * ============================================================
 */

import type { Metadata, Viewport } from 'next'
import './globals.css'

import { QueryProvider } from '../shared/providers/QueryProvider'
import { AuthProvider } from '../features/auth/context/AuthContext'

export const metadata: Metadata = {
  title: 'FTM Ticketera',
  description: 'Sistema de venta y gestión de entradas - FTM Producciones',
  keywords: ['tickets', 'eventos', 'entradas', 'chile', 'ftm'],
  authors: [{ name: 'Matías Carrión' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}