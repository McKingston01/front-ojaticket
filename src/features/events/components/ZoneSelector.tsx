/**
 * ============================================================
 * @file        ZoneSelector.tsx
 * @description Selector de zonas y cantidad de tickets
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useState } from 'react'
import { formatMoney } from '@/shared/utils/formatters'
import { useReserveTickets } from '@/features/tickets/hooks/useReserveTickets'
import type { EventPublicDetailDTO } from '@/shared/types'

interface ZoneSelectorProps {
  event: EventPublicDetailDTO
}

export function ZoneSelector({ event }: ZoneSelectorProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  
  const { mutate: reserve, isPending } = useReserveTickets()

  const handleReserve = () => {
    if (!selectedZone) return
    
    reserve({
      eventId: event.id,
      zoneId: selectedZone,
      quantity,
    })
  }

  const zone = event.zones.find(z => z.id === selectedZone)
  const maxQuantity = zone ? Math.min(zone.available, 5) : 5

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Selecciona tu zona</h2>
      
      <div className="space-y-4 mb-6">
        {event.zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z.id)}
            disabled={z.available === 0 || !event.actions.canReserve}
            className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
              selectedZone === z.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              z.available === 0 || !event.actions.canReserve
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{z.name}</h3>
                <p className="text-sm text-gray-600">
                  Disponibles: {z.available} de {z.capacity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatMoney(z.price)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedZone && (
        <div className="border-t pt-6">
          <label className="block mb-2 font-medium">
            Cantidad de tickets
          </label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          >
            {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'ticket' : 'tickets'}
              </option>
            ))}
          </select>

          {zone && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span>Precio unitario:</span>
                <span className="font-medium">{formatMoney(zone.price)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatMoney(zone.price * quantity)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleReserve}
            disabled={isPending || !event.actions.canReserve}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Reservando...' : 'Reservar Tickets'}
          </button>
          
          <p className="text-sm text-gray-500 mt-2 text-center">
            Tu reserva expirará en 15 minutos
          </p>
        </div>
      )}

      {!event.actions.canReserve && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-yellow-800 text-sm">
            Debes iniciar sesión para reservar tickets
          </p>
        </div>
      )}
    </div>
  )
}