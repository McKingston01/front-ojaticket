/**
 * ============================================================
 * @file        formatters.ts
 * @description Utilidades de formateo (fechas, dinero, etc)
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Formatea fecha ISO a formato legible español
 * @example formatDate("2025-01-16T20:00:00Z") → "16 de enero, 2025"
 */
export function formatDate(isoString: string): string {
  return format(parseISO(isoString), "dd 'de' MMMM, yyyy", { locale: es })
}

/**
 * Formatea fecha y hora ISO a formato legible
 * @example formatDateTime("2025-01-16T20:00:00Z") → "16/01/2025 20:00"
 */
export function formatDateTime(isoString: string): string {
  return format(parseISO(isoString), 'dd/MM/yyyy HH:mm', { locale: es })
}

/**
 * Formatea dinero en pesos chilenos
 * @example formatMoney(15000) → "$15.000"
 */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea bytes a formato legible
 * @example formatBytes(1536) → "1.50 KB"
 */
export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Formatea duración en segundos a formato legible
 * @example formatDuration(3665) → "1h 1m 5s"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(' ')
}