import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PAYMENT_COLORS, STATUS_COLORS } from '@entities/order'
import { useOrders } from '@entities/order/api/queries/useOrders'
import type { Order } from '@entities/order/model/types'
import { useOrderFilters } from '@features/filter-orders/model/useOrderFilters'
import { formatUSD } from '@shared/lib/currency'
import { formatAbsolute, formatRelative } from '@shared/lib/date'
import { isSlaBreached } from '@shared/lib/sla'
import { cn } from '@shared/lib/utils'
import { useUIStore } from '@shared/store/uiStore'
import { ServiceIcon } from '@shared/ui/icons/ServiceIcon'
import { AlertCircle, ClipboardList, RefreshCw } from 'lucide-react'
import { SlaBreachBadge } from './SlaBreachBadge'

function StatusBadge({ status }: { status: Order['status'] }) {
  const c = STATUS_COLORS[status]
  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border-transparent',
        c.bg,
        c.text
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {status}
    </Badge>
  )
}

function PaymentBadge({ status }: { status: Order['paymentStatus'] }) {
  const c = PAYMENT_COLORS[status]
  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border-transparent',
        c.bg,
        c.text
      )}
    >
      {status}
    </Badge>
  )
}

function OrderRow({ order }: { order: Order }) {
  const openDrawer = useUIStore((s) => s.openDrawer)
  const breached = isSlaBreached(order.orderTime, order.status)

  return (
    <TableRow
      onClick={() => openDrawer(order.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDrawer(order.id)}
      role="button"
      tabIndex={0}
      className={cn(
        'group cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none',
        breached && 'border-l-2 border-l-red-500'
      )}
      aria-label={`Open order ${order.id}`}
    >
      <TableCell className="py-3 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
          {breached && <SlaBreachBadge orderTime={order.orderTime} status={order.status} compact />}
        </div>
      </TableCell>
      <TableCell className="py-3">
        <span className="text-xs font-semibold text-foreground">{order.guestName}</span>
      </TableCell>
      <TableCell className="py-3">
        <Badge variant="secondary" className="px-1.5 py-0 rounded text-[11px]">
          {order.roomNumber}
        </Badge>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-2 text-xs">
          <ServiceIcon service={order.service} className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{order.service}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 text-muted-foreground">{order.quantity}×</TableCell>
      <TableCell className="py-3 font-medium">{formatUSD(order.amount)}</TableCell>
      <TableCell className="py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground cursor-help underline decoration-dotted">
                {formatRelative(order.orderTime)}
              </span>
            </TooltipTrigger>
            <TooltipContent className="text-xs">{formatAbsolute(order.orderTime)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="py-3">
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell className="py-3">
        <PaymentBadge status={order.paymentStatus} />
      </TableCell>
    </TableRow>
  )
}

function OrderCard({ order }: { order: Order }) {
  const openDrawer = useUIStore((s) => s.openDrawer)
  const breached = isSlaBreached(order.orderTime, order.status)

  return (
    <div
      onClick={() => openDrawer(order.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDrawer(order.id)}
      role="button"
      tabIndex={0}
      className={cn(
        'w-full cursor-pointer rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        breached && 'border-l-4 border-l-red-500'
      )}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[10px] text-muted-foreground">{order.id}</span>
          <p className="text-xs font-semibold text-foreground">{order.guestName}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={order.status} />
          {breached && <SlaBreachBadge orderTime={order.orderTime} status={order.status} compact />}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="px-1 py-0 text-[10px] font-medium rounded">
          Room {order.roomNumber}
        </Badge>
        <span className="flex items-center gap-1">
          <ServiceIcon service={order.service} className="h-3 w-3" />
          {order.service}
        </span>
        <span>•</span>
        <span>{formatRelative(order.orderTime)}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-xs">
        <PaymentBadge status={order.paymentStatus} />
        <span className="font-semibold text-foreground">{formatUSD(order.amount)}</span>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((rowVal) => (
        <TableRow key={rowVal}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((colVal) => (
            <TableCell key={colVal} className="py-4">
              <Skeleton
                className="h-4 rounded"
                style={{ width: `${55 + ((rowVal + colVal) % 4) * 10}%` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function OrderList() {
  const { filters, setFilter } = useOrderFilters()
  const { data, isLoading, isError, refetch } = useOrders(filters)
  const orders = data?.data ?? []

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-destructive animate-bounce" />
        <p className="mb-1 text-sm font-semibold text-foreground">Unable to load orders</p>
        <p className="mb-4 text-xs text-muted-foreground">
          Please check your connection and try again
        </p>
        <Button type="button" onClick={() => refetch()} size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    )
  }

  const EmptyState = (
    <div className="flex flex-col items-center py-16 text-center">
      <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/30 animate-pulse" />
      <p className="text-sm font-semibold text-foreground animate-fade-in">No orders found</p>
      <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  )

  const handlePageChange = (newPage: number) => {
    setFilter('page', newPage)
  }

  return (
    <div className="space-y-4">
      {/* Mobile card list */}
      <div className="space-y-2 md:hidden">
        {isLoading
          ? [1, 2, 3, 4, 5].map((v) => (
              <div key={v} className="rounded-lg border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : orders.length === 0
            ? EmptyState
            : orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {[
                'Order ID',
                'Guest',
                'Room',
                'Service',
                'Qty',
                'Amount',
                'Time',
                'Status',
                'Payment',
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2.5 h-10"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  {EmptyState}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => <OrderRow key={order.id} order={order} />)
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && data.meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
            <span>
              Showing {orders.length} of {data.meta.total} orders
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!filters.page || filters.page <= 1}
                onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                className="h-7 text-xs px-2 hover:bg-accent disabled:opacity-40"
              >
                ← Prev
              </Button>
              <span className="px-2 font-medium">Page {filters.page ?? 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!data.meta.hasMore}
                onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                className="h-7 text-xs px-2 hover:bg-accent disabled:opacity-40"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
