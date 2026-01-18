/**
 * ============================================================
 * @file        useAvailability.ts
 * @description Hook para disponibilidad en tiempo real
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { AvailabilityDTO } from '@/shared/types'

export function useAvailability(eventId: string) {
  return useQuery<AvailabilityDTO>({
    queryKey: ['availability', eventId],
    queryFn: async () => {
      const response = await apiClient.get<AvailabilityDTO>(
        `/events/${eventId}/availability`,
        { skipAuth: true }
      )
      return response
    },
    refetchInterval: 10000, // 10 segundos
    staleTime: 0, // NO cache (real-time)
    enabled: !!eventId,
  })
}