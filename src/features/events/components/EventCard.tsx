/**
 * ============================================================
 * @file        EventCard.tsx
 * @description Card de evento en listado público
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { EventPublicListItemDTO } from '@/shared/types'
import { formatDate, formatMoney } from '@/shared/utils/formatters'

interface EventCardProps {
  event: EventPublicListItemDTO
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {event.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        
        <p className="text-gray-600 text-sm mb-2">
          {formatDate(event.startDateTime)}
        </p>
        
        <p className="text-gray-500 text-sm mb-3">
          {event.venue.name} • {event.venue.city}
        </p>
        
        <p className="text-lg font-semibold mb-4">
          Desde {formatMoney(event.minPrice)}
        </p>
        
        <div className="mt-4">
          {!event.actions.isAvailable ? (
            <div className="bg-red-100 text-red-800 px-3 py-2 rounded text-center font-medium">
              Agotado
            </div>
          ) : event.actions.canPurchase ? (
            <button
              onClick={() => router.push(`/events/${event.id}`)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Detalles
            </button>
          ) : (
            <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-center font-medium">
              Próximamente
            </div>
          )}
        </div>
      </div>
    </div>
  )
}