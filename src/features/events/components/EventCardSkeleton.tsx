/**
 * ============================================================
 * @file        EventCardSkeleton.tsx
 * @description Skeleton loader para EventCard
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

export function EventCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  )
}