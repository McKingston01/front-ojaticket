/**
 * ============================================================
 * @file        PaymentButton.tsx
 * @description Botón para procesar pago
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useProcessCheckout } from '@/features/checkout/hooks/useProcessCheckout'

interface PaymentButtonProps {
  reservationId: string
  disabled?: boolean
}

export function PaymentButton({ reservationId, disabled }: PaymentButtonProps) {
  const { mutate: processCheckout, isPending } = useProcessCheckout()

  return (
    <button
      onClick={() => processCheckout(reservationId)}
      disabled={disabled || isPending}
      className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? 'Procesando...' : 'Pagar con MercadoPago'}
    </button>
  )
}