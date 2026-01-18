/**
 * ============================================================
 * @file        EventFilters.tsx
 * @description Filtros para listado de eventos
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import type { EventFiltersDTO } from '@/shared/types'

interface EventFiltersProps {
  filters: EventFiltersDTO
  onChange: (filters: EventFiltersDTO) => void
}

export function EventFilters({ filters, onChange }: EventFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-lg font-bold mb-4">Filtrar Eventos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            value={filters.city || ''}
            onChange={(e) => onChange({ ...filters, city: e.target.value, page: 1 })}
            placeholder="Santiago, Buenos Aires..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde
          </label>
          <input
            id="date_from"
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => onChange({ ...filters, date_from: e.target.value, page: 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="price_min" className="block text-sm font-medium text-gray-700 mb-1">
            Precio mínimo
          </label>
          <input
            id="price_min"
            type="number"
            value={filters.price_min || ''}
            onChange={(e) => onChange({ 
              ...filters, 
              price_min: e.target.value ? Number(e.target.value) : undefined,
              page: 1 
            })}
            placeholder="5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sort"
            value={filters.sort || 'date'}
            onChange={(e) => onChange({ 
              ...filters, 
              sort: e.target.value as 'date' | 'price' | 'title',
              page: 1 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Fecha</option>
            <option value="price">Precio</option>
            <option value="title">Nombre</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={() => onChange({ page: 1, limit: 20, sort: 'date', order: 'asc' })}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Limpiar filtros
      </button>
    </div>
  )
}