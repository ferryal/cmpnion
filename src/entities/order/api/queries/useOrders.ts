import { useQuery } from '@tanstack/react-query'
import type { OrderFilters } from '../../model/types'
import { getOrders } from '../orderApi'
import { orderKeys } from './queryKeys'

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => getOrders(filters),
  })
}
