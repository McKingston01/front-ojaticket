/**
 * ============================================================
 * @file        page.tsx
 * @description Página de checkout
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useValidateCheckout } from '@/features/checkout/hooks/useValidateCheckout'
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary'
import { PaymentButton } from '@/features/checkout/components/PaymentButton'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get('reservationId')

  const { data: validation, isLoading, error } = useValidateCheckout(reservationId)

  useEffect(() => {
    if (!reservationId) {
      router.push('/events')
    }
  }, [reservationId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !validation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-bold mb-2">Error en Checkout</h2>
            <p className="text-red-600">
              No pudimos validar tu reserva. Por favor intenta nuevamente.
            </p>
            <button
              onClick={() => router.push('/events')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Volver a Eventos
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!validation.valid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-yellow-800 font-bold mb-4">Problemas con la Reserva</h2>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              {validation.errors?.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
            </ul>
            <button
              onClick={() => router.push('/events')}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Volver a Eventos
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Obtener la reserva del localStorage (guardada en useReserveTickets)
  const reservationData = localStorage.getItem('current_reservation')
  const reservation = reservationData ? JSON.parse(reservationData) : null

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-bold mb-2">Reserva no encontrada</h2>
            <p className="text-red-600">
              No pudimos encontrar los detalles de tu reserva.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Checkout</h1>
        
        <CheckoutSummary reservation={reservation} />
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
          <p className="text-gray-600 mb-6">
            Serás redirigido a MercadoPago para completar el pago de forma segura.
          </p>
          
          <PaymentButton reservationId={reservationId!} disabled={!validation.valid} />
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            Al hacer clic, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  )
}