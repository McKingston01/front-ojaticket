/**
 * ============================================================
 * @file        Pagination.tsx
 * @description Componente de paginación
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import type { PaginationMetadataDTO } from '@/shared/types'

interface PaginationProps {
  pagination: PaginationMetadataDTO
  onPageChange: (page: number) => void
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const startItem = ((pagination.page - 1) * pagination.limit) + 1
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className="flex items-center justify-between mt-8 px-4">
      <p className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{pagination.total}</span> resultados
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Anterior
        </button>
        
        <span className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium">
          {pagination.page} / {pagination.totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}