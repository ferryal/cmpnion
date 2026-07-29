import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '../orderApi'
import { orderKeys } from './queryKeys'

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  })
}
