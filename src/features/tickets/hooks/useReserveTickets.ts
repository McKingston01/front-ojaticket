/**
 * ============================================================
 * @file        useReserveTickets.ts
 * @description Hook para crear reserva de tickets
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/shared/lib/api-client'
import type { CreateReservationDTO, ReservationDTO } from '@/shared/types'

export function useReserveTickets() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReservationDTO) => {
      const response = await apiClient.post<ReservationDTO>(
        '/reservations',
        data
      )
      return response
    },
    onSuccess: (data) => {
      // Invalidar cache de availability
      queryClient.invalidateQueries({ queryKey: ['availability'] })
      
      // Redirigir a checkout con reservationId
      router.push(`/checkout?reservationId=${data.reservationId}`)
    },
  })
}