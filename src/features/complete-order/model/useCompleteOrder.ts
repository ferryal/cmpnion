import { useUpdateOrderStatus } from '@entities/order/api/mutations/useUpdateOrderStatus'
import { track } from '@shared/lib/analytics'

export function useCompleteOrder(orderId: string) {
  const { mutate, isPending } = useUpdateOrderStatus()
  return {
    complete: () => {
      mutate({ id: orderId, body: { status: 'Completed' } })
      track('order_completed', { orderId })
    },
    isPending,
  }
}
