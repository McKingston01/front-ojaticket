/**
 * ============================================================
 * @file        VenueInfo.tsx
 * @description Información del venue con mapa
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import type { EventPublicDetailDTO } from '@/shared/types'

interface VenueInfoProps {
  venue: EventPublicDetailDTO['venue']
}

export function VenueInfo({ venue }: VenueInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
      
      <div className="space-y-2 mb-4">
        <p className="font-medium text-lg">{venue.name}</p>
        <p className="text-gray-600">{venue.address}</p>
        <p className="text-gray-600">
          {venue.city}, {venue.country}
        </p>
      </div>

      {venue.coordinates && (
        <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${venue.coordinates.latitude},${venue.coordinates.longitude}&zoom=15`}
          />
        </div>
      )}
    </div>
  )
}