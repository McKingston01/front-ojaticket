/**
 * ============================================================
 * @file        EventDetail.tsx
 * @description Detalle completo del evento
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import Image from 'next/image'
import { formatDate, formatDateTime } from '@/shared/utils/formatters'
import { useAvailability } from '@/features/tickets/hooks/useAvailability'
import type { EventPublicDetailDTO } from '@/shared/types'

interface EventDetailProps {
  event: EventPublicDetailDTO
}

export function EventDetail({ event }: EventDetailProps) {
  const { data: availability } = useAvailability(event.id)

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {event.imageUrl && (
        <div className="relative h-96 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        
        <div className="flex items-center gap-4 mb-6 text-gray-600">
          <div>
            <p className="text-sm">Fecha</p>
            <p className="font-medium">{formatDate(event.startDateTime)}</p>
          </div>
          <div className="border-l pl-4">
            <p className="text-sm">Hora</p>
            <p className="font-medium">{formatDateTime(event.startDateTime)}</p>
          </div>
          {availability && (
            <div className="border-l pl-4">
              <p className="text-sm">Disponibles</p>
              <p className="font-medium">{availability.available} de {availability.total}</p>
            </div>
          )}
        </div>

        {!event.actions.isAvailable && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-bold">🚫 Evento agotado o cancelado</p>
          </div>
        )}

        <div className="prose max-w-none mb-6">
          <h2 className="text-2xl font-bold mb-3">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-3">Organizado por</h2>
          <p className="font-medium">{event.producer.name}</p>
          <p className="text-sm text-gray-600">{event.producer.email}</p>
        </div>
      </div>
    </div>
  )
}