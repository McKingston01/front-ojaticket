/**
 * ============================================================
 * @file        page.tsx
 * @description Página de checkout fallido
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useRouter } from 'next/navigation'

export default function CheckoutFailurePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Pago No Completado</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Tu pago no pudo ser procesado.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-red-800 mb-2">¿Qué pasó?</h2>
          <p className="text-red-700 text-sm mb-4">
            El pago fue rechazado o cancelado. No te preocupes, no se realizó ningún cargo.
          </p>
          <p className="text-red-700 text-sm">
            Tu reserva fue liberada automáticamente.
          </p>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => router.push('/events')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Eventos
          </button>
          
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-300 transition-colors"
          >
            Intentar Nuevamente
          </button>
        </div>
      </div>
    </div>
  )
}