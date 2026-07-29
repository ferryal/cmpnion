import { useUpdateOrderStatus } from '@entities/order/api/mutations/useUpdateOrderStatus'
import { track } from '@shared/lib/analytics'

export function useApproveExtraBed(orderId: string) {
  const { mutate, isPending } = useUpdateOrderStatus()
  return {
    approve: () => {
      mutate({ id: orderId, body: { status: 'New' } })
      track('order_approved', { orderId })
    },
    reject: (onSuccess?: () => void) => {
      mutate({ id: orderId, body: { status: 'Cancelled' } }, { onSuccess })
      track('order_rejected', { orderId })
    },
    isPending,
  }
}
