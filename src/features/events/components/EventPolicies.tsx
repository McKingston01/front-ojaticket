/**
 * ============================================================
 * @file        EventPolicies.tsx
 * @description Políticas del evento (reembolsos, transferencias)
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import type { EventPublicDetailDTO } from '@/shared/types'

interface EventPoliciesProps {
  event: EventPublicDetailDTO
}

export function EventPolicies({ event }: EventPoliciesProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Políticas del Evento</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-bold mb-2">Reembolsos</h3>
          {event.refundPolicy.allowRefunds ? (
            <div className="text-gray-700">
              <p>✅ Se permiten reembolsos</p>
              {event.refundPolicy.refundableUntilHours && (
                <p className="text-sm">
                  Hasta {event.refundPolicy.refundableUntilHours} horas antes del evento
                </p>
              )}
              {event.refundPolicy.refundPercentage && (
                <p className="text-sm">
                  Devolución del {event.refundPolicy.refundPercentage}% del valor
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-700">❌ No se permiten reembolsos</p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-2">Transferencias</h3>
          {event.allowTransfers ? (
            <p className="text-gray-700">✅ Se permiten transferencias (máximo 1 por ticket)</p>
          ) : (
            <p className="text-gray-700">❌ No se permiten transferencias</p>
          )}
        </div>

        {event.ageRestriction && (
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Restricción de Edad</h3>
            <p className="text-gray-700">🔞 Evento para mayores de {event.ageRestriction} años</p>
          </div>
        )}

        {event.termsAndConditions && (
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Términos y Condiciones</h3>
            <div className="text-sm text-gray-600 whitespace-pre-line">
              {event.termsAndConditions}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}