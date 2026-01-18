/**
 * ============================================================
 * @file        useValidateCheckout.ts
 * @description Hook para validar checkout antes de pagar
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { ValidationResultDTO } from '@/shared/types'

export function useValidateCheckout(reservationId: string | null) {
  return useQuery<ValidationResultDTO>({
    queryKey: ['validate-checkout', reservationId],
    queryFn: async () => {
      if (!reservationId) {
        throw new Error('No reservation ID')
      }
      
      const response = await apiClient.post<ValidationResultDTO>(
        '/checkout/validate',
        { reservationId }
      )
      return response
    },
    enabled: !!reservationId,
    staleTime: 0, // Siempre revalidar
    retry: false,
  })
}