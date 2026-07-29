import { useUIStore } from '@shared/store/uiStore'
import { OrderDrawer } from '@widgets/order-detail'
import { FilterBar } from '@widgets/order-filters'
import { OrderList } from '@widgets/order-list'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export default function OrdersPage() {
  const { orderId } = useParams()
  const openDrawer = useUIStore((s) => s.openDrawer)

  // Deep-link: auto-open drawer if orderId in URL
  useEffect(() => {
    if (orderId) openDrawer(orderId)
  }, [orderId, openDrawer])

  return (
    <div className="mx-auto max-w-screen-xl p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track guest service requests</p>
      </div>

      <div className="space-y-4">
        <FilterBar />
        <OrderList />
      </div>

      <OrderDrawer />
    </div>
  )
}
