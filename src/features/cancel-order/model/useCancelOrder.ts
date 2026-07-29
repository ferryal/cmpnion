import { useUpdateOrderStatus } from '@entities/order/api/mutations/useUpdateOrderStatus'
import { track } from '@shared/lib/analytics'

export function useCancelOrder(orderId: string) {
  const { mutate, isPending } = useUpdateOrderStatus()
  return {
    cancel: (onSuccess?: () => void) => {
      mutate({ id: orderId, body: { status: 'Cancelled' } }, { onSuccess })
      track('order_cancelled', { orderId })
    },
    isPending,
  }
}
