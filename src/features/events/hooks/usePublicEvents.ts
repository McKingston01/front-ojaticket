/**
 * ============================================================
 * @file        usePublicEvents.ts
 * @description Hook para obtener listado público de eventos
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { EventFiltersDTO, EventsListResponseDTO } from '@/shared/types'

/**
 * Hook para obtener listado público de eventos con filtros y paginación
 */
export function usePublicEvents(filters: EventFiltersDTO) {
  const queryParams = new URLSearchParams()

  // Agregar filtros solo si tienen valor
  if (filters.city) queryParams.append('city', filters.city)
  if (filters.date_from) queryParams.append('date_from', filters.date_from)
  if (filters.date_to) queryParams.append('date_to', filters.date_to)
  if (filters.price_min !== undefined) queryParams.append('price_min', String(filters.price_min))
  if (filters.price_max !== undefined) queryParams.append('price_max', String(filters.price_max))
  
  // Paginación y ordenamiento
  queryParams.append('page', String(filters.page || 1))
  queryParams.append('limit', String(filters.limit || 20))
  queryParams.append('sort', filters.sort || 'date')
  queryParams.append('order', filters.order || 'asc')

  return useQuery<EventsListResponseDTO>({
    queryKey: ['events', filters],
    queryFn: async () => {
      const response = await apiClient.get<EventsListResponseDTO>(
        `/events?${queryParams.toString()}`,
        { skipAuth: true }
      )
      return response
    },
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 120 * 60 * 1000,   // 2 horas (antes cacheTime)
  })
}