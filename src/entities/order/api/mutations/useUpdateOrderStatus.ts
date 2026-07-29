import { dashboardKeys } from '@entities/dashboard/api/queries/queryKeys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { OrderListResponse } from '../../model/types'
import { updateOrderStatus } from '../orderApi'
import { orderKeys } from '../queries/queryKeys'

interface UpdateStatusBody {
  status: string
  staffNote?: string
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateStatusBody }) =>
      updateOrderStatus(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: orderKeys.lists() })
      const previousData = queryClient.getQueriesData<OrderListResponse>({
        queryKey: orderKeys.lists(),
      })

      queryClient.setQueriesData<OrderListResponse>({ queryKey: orderKeys.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((o) =>
            o.id === id
              ? { ...o, status: body.status as never, updatedAt: new Date().toISOString() }
              : o
          ),
        }
      })

      return { previousData }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data)
        }
      }
      toast.error('Failed to update order status. Please try again.')
    },

    onSuccess: (_data, { body }) => {
      toast.success(`Order ${body.status.toLowerCase()} successfully.`)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
