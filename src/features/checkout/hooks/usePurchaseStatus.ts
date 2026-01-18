/**
 * ============================================================
 * @file        usePurchaseStatus.ts
 * @description Hook para polling de status de compra
 * @author      Matías Carrión
 * @created     2025-01-16
 * @version     1.0.0
 * ============================================================
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import type { PurchaseCustomerDTO } from '@/shared/types'

export function usePurchaseStatus(purchaseId: string | null, enabled: boolean = true) {
  return useQuery<PurchaseCustomerDTO>({
    queryKey: ['purchase-status', purchaseId],
    queryFn: async () => {
      if (!purchaseId) {
        throw new Error('No purchase ID')
      }
      
      const response = await apiClient.get<PurchaseCustomerDTO>(
        `/purchases/${purchaseId}`
      )
      return response
    },
    enabled: !!purchaseId && enabled,
    refetchInterval: 3000, // Poll cada 3s
    staleTime: 0,
    retry: false,
  })
}