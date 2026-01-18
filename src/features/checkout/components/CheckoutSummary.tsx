/**
 * ============================================================
 * @file        CheckoutSummary.tsx
 * @description Resumen de la compra en checkout
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { formatMoney, formatDateTime } from '@/shared/utils/formatters'
import type { ReservationDTO } from '@/shared/types'

interface CheckoutSummaryProps {
  reservation: ReservationDTO
}

export function CheckoutSummary({ reservation }: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Resumen de Compra</h2>
      
      <div className="space-y-4 mb-6">
        {reservation.tickets.map((ticket, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">{ticket.zoneName}</p>
              <p className="text-sm text-gray-600">
                {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatMoney(ticket.unitPrice * ticket.quantity)}</p>
              <p className="text-sm text-gray-600">
                {formatMoney(ticket.unitPrice)} c/u
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span>{formatMoney(reservation.totalAmount)}</span>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⏰ Tu reserva expira el {formatDateTime(reservation.expiresAt)}
        </p>
      </div>
    </div>
  )
}