/**
 * ============================================================
 * @file        page.tsx
 * @description Página de listado público de eventos
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

'use client'

import { useState } from 'react'
import { usePublicEvents } from '@/features/events/hooks/usePublicEvents'
import { EventCard } from '@/features/events/components/EventCard'
import { EventFilters } from '@/features/events/components/EventFilters'
import { EventCardSkeleton } from '@/features/events/components/EventCardSkeleton'
import { Pagination } from '@/features/events/components/Pagination'
import type { EventFiltersDTO } from '@/shared/types'

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFiltersDTO>({
    page: 1,
    limit: 20,
    sort: 'date',
    order: 'asc',
  })

  const { data, isLoading, error } = usePublicEvents(filters)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-bold mb-2">Error al cargar eventos</h2>
          <p className="text-red-600">
            No pudimos cargar los eventos. Por favor intenta nuevamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Eventos</h1>
      
      <EventFilters filters={filters} onChange={setFilters} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {data.pagination.totalPages > 1 && (
            <Pagination
              pagination={data.pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron eventos con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  )
}