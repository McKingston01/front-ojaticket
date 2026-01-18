/**
 * ============================================================
 * @file        useProcessCheckout.ts
 * @description Hook para procesar pago (MercadoPago redirect)
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/shared/lib/api-client'
import { HttpError } from '@/shared/lib/http-error'
import type { CheckoutResponseDTO } from '@/shared/types'

export function useProcessCheckout() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await apiClient.post<CheckoutResponseDTO>(
        '/checkout/process',
        {
          reservationId,
          paymentMethod: 'mercadopago',
        }
      )
      return response
    },
    onSuccess: (data) => {
      // Redirigir a MercadoPago
      window.location.href = data.redirectUrl
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError) {
        // Backend ya hizo rollback automático (Saga Pattern)
        
        // CAMBIADO: Usar error.errorCode en lugar de error.code
        if (error.errorCode === 'PAYMENT_FAILED') {
          alert(
            'El pago no se completó. Tu reserva fue liberada automáticamente.'
          )
          router.push('/events')
          return
        }
        
        // CAMBIADO: Usar error.errorCode en lugar de error.code
        if (error.errorCode === 'TICKETS_GENERATION_FAILED') {
          alert(
            'Hubo un error al generar tus tickets. ' +
            'Se procesará un reembolso automático en 3-5 días hábiles.'
          )
          router.push('/dashboard/customer')
          return
        }
        
        // CAMBIADO: Usar error.errorCode en lugar de error.code
        if (error.errorCode === 'RESERVATION_EXPIRED') {
          alert('Tu reserva expiró. Por favor intenta nuevamente.')
          router.push('/events')
          return
        }
        
        // Error genérico
        alert('Ocurrió un error al procesar el pago. Intenta nuevamente.')
      }
    },
  })
}