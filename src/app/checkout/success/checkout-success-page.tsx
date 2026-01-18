/**
 * ============================================================
 * @file        page.tsx
 * @description Página de checkout exitoso (con polling)
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { usePurchaseStatus } from '@/features/checkout/hooks/usePurchaseStatus'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const purchaseId = searchParams.get('purchaseId')
  
  const [retryCount, setRetryCount] = useState(0)
  const [status, setStatus] = useState<'processing' | 'approved' | 'timeout'>('processing')

  const { data: purchase } = usePurchaseStatus(
    purchaseId,
    status === 'processing'
  )

  useEffect(() => {
    if (!purchaseId) {
      router.push('/events')
      return
    }
  }, [purchaseId, router])

  useEffect(() => {
    if (!purchase) return

    if (purchase.status === 'approved') {
      setStatus('approved')
      // Limpiar reserva de localStorage
      localStorage.removeItem('current_reservation')
    } else if (retryCount > 10) {
      setStatus('timeout')
    } else {
      setRetryCount(prev => prev + 1)
    }
  }, [purchase, retryCount])

  if (status === 'processing') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Procesando tu pago...</h2>
          <p className="text-gray-600 mb-4">
            Por favor espera mientras confirmamos tu compra.
          </p>
          {retryCount > 5 && (
            <p className="text-yellow-600 text-sm">
              Esto está tomando más tiempo de lo usual. Por favor espera.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (status === 'timeout') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-yellow-800">
              Error de Timeout
            </h2>
            <p className="text-yellow-700 mb-6">
              No pudimos confirmar tu pago. Revisa tu email o contacta soporte.
            </p>
            <button
              onClick={() => router.push('/dashboard/customer')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Ir a Mis Tickets
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">¡Compra Exitosa!</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Tus tickets fueron enviados a tu email.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-800 mb-2">
            <strong>ID de Compra:</strong> {purchaseId}
          </p>
          <p className="text-blue-700 text-sm">
            Guarda este número para futuras consultas
          </p>
        </div>
        
        <button
          onClick={() => router.push('/dashboard/customer')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
        >
          Ver Mis Tickets
        </button>
      </div>
    </div>
  )
}