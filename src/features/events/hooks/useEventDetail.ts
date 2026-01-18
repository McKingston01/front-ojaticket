/**
 * ============================================================
 * @file        useEventDetail.ts
 * @description Hook para obtener detalle de evento público
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { EventPublicDetailDTO } from '@/shared/types'

export function useEventDetail(eventId: string) {
  return useQuery<EventPublicDetailDTO>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await apiClient.get<EventPublicDetailDTO>(
        `/events/${eventId}`,
        { skipAuth: true }
      )
      return response
    },
    staleTime: 60 * 60 * 1000, 
    enabled: !!eventId,
  })
}