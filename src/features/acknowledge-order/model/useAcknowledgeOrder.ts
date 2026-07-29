import { useUpdateOrderStatus } from '@entities/order/api/mutations/useUpdateOrderStatus'
import { track } from '@shared/lib/analytics'

export function useAcknowledgeOrder(orderId: string) {
  const { mutate, isPending } = useUpdateOrderStatus()
  return {
    acknowledge: () => {
      mutate({ id: orderId, body: { status: 'Acknowledged' } })
      track('order_acknowledged', { orderId })
    },
    isPending,
  }
}
