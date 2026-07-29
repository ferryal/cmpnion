import { useUpdateOrderStatus } from '@entities/order/api/mutations/useUpdateOrderStatus'
import { track } from '@shared/lib/analytics'

export function useStartProcessing(orderId: string) {
  const { mutate, isPending } = useUpdateOrderStatus()
  return {
    start: () => {
      mutate({ id: orderId, body: { status: 'In Progress' } })
      track('order_started', { orderId })
    },
    isPending,
  }
}
