import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PAYMENT_COLORS,
  STATUS_COLORS,
  TIMELINE_STEPS,
  getAvailableTransitions,
  getTimelineStepIndex,
  isTerminalStatus,
} from '@entities/order'
import { useOrder } from '@entities/order/api/queries/useOrder'
import type { Transition } from '@entities/order/model/orderStateMachine'
import type { Order, OrderStatus } from '@entities/order/model/types'
import { useAcknowledgeOrder } from '@features/acknowledge-order/model/useAcknowledgeOrder'
import { useApproveExtraBed } from '@features/approve-extra-bed/model/useApproveExtraBed'
import { useCancelOrder } from '@features/cancel-order/model/useCancelOrder'
import { useCompleteOrder } from '@features/complete-order/model/useCompleteOrder'
import { useStartProcessing } from '@features/start-processing-order/model/useStartProcessing'
import { formatUSD } from '@shared/lib/currency'
import { formatAbsolute, formatRelative } from '@shared/lib/date'
import { cn } from '@shared/lib/utils'
import { useUIStore } from '@shared/store/uiStore'
import { ServiceIcon } from '@shared/ui/icons/ServiceIcon'
import { SlaBreachBadge } from '@widgets/order-list/SlaBreachBadge'
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react'
import { useState } from 'react'

// ─── Status Timeline ──────────────────────────────────────────
function StatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIdx = getTimelineStepIndex(currentStatus)
  const isCancelled = currentStatus === 'Cancelled'

  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-1">
        {TIMELINE_STEPS.map((step, idx) => {
          const done = idx < currentIdx
          const current = idx === currentIdx && !isCancelled
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isCancelled
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                    : done
                      ? 'bg-foreground text-background'
                      : current
                        ? 'border-2 border-foreground bg-background text-foreground'
                        : 'border border-border bg-background text-muted-foreground'
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span>{idx + 1}</span>}
              </div>
              <span
                className={cn(
                  'text-center text-[10px] font-medium leading-tight',
                  current ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step}
              </span>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    'absolute top-3 h-[1px] transition-colors',
                    done ? 'bg-foreground' : 'bg-border'
                  )}
                  style={{
                    left: `calc(${((idx + 0.5) / TIMELINE_STEPS.length) * 100}% + 12px)`,
                    width: `calc(${(1 / TIMELINE_STEPS.length) * 100}% - 24px)`,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {isCancelled && (
        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <X className="h-3 w-3" />
          Order was cancelled
        </div>
      )}
    </div>
  )
}

// ─── Row util ─────────────────────────────────────────────────
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  )
}

// ─── Drawer content ───────────────────────────────────────────
function DrawerContent({ order }: { order: Order }) {
  const [showCancel, setShowCancel] = useState(false)
  const transitions: Transition[] = getAvailableTransitions(order.status)
  const terminal = isTerminalStatus(order.status)

  const statusColors = STATUS_COLORS[order.status]
  const paymentColors = PAYMENT_COLORS[order.paymentStatus]

  const { acknowledge, isPending: isAckPending } = useAcknowledgeOrder(order.id)
  const { start, isPending: isStartPending } = useStartProcessing(order.id)
  const { complete, isPending: isCompletePending } = useCompleteOrder(order.id)
  const { cancel, isPending: isCancelPending } = useCancelOrder(order.id)
  const { approve, reject, isPending: isApprovalPending } = useApproveExtraBed(order.id)

  const isPending =
    isAckPending || isStartPending || isCompletePending || isCancelPending || isApprovalPending

  const isPendingApproval = order.status === 'Pending Approval'

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <SheetHeader className="border-b border-border p-4 pr-12 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
            <SheetTitle className="mt-0.5 text-base font-semibold text-foreground">
              {order.guestName}
            </SheetTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md border-transparent',
              statusColors.bg,
              statusColors.text
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', statusColors.dot)} />
            {order.status}
          </Badge>
        </div>
        <div className="mt-2">
          <SlaBreachBadge orderTime={order.orderTime} status={order.status} />
        </div>
      </SheetHeader>

      {/* Scrollable body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Timeline */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Progress
          </p>
          <StatusTimeline currentStatus={order.status} />
        </div>

        <div className="border-t border-border" />

        {/* Details */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </p>
          <div className="divide-y divide-border rounded-md border border-border bg-muted/10">
            <div className="px-3">
              <DetailRow label="Room">{order.roomNumber}</DetailRow>
            </div>
            <div className="px-3">
              <DetailRow label="Service">
                <span className="flex items-center gap-1.5">
                  <ServiceIcon
                    service={order.service}
                    className="h-3.5 w-3.5 text-muted-foreground"
                  />
                  {order.service}
                </span>
              </DetailRow>
            </div>
            <div className="px-3">
              <DetailRow label="Quantity">{order.quantity}×</DetailRow>
            </div>
            <div className="px-3">
              <DetailRow label="Amount">{formatUSD(order.amount)}</DetailRow>
            </div>
            <div className="px-3">
              <DetailRow label="Payment">
                <Badge
                  variant="outline"
                  className={cn(
                    'px-2 py-0.5 text-xs font-semibold rounded-md border-transparent',
                    paymentColors.bg,
                    paymentColors.text
                  )}
                >
                  {order.paymentStatus}
                </Badge>
              </DetailRow>
            </div>
            <div className="px-3">
              <DetailRow label="Ordered">
                <span className="flex flex-col items-end gap-0.5">
                  <span>{formatRelative(order.orderTime)}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatAbsolute(order.orderTime)}
                  </span>
                </span>
              </DetailRow>
            </div>
            {order.specialRequest && (
              <div className="px-3 py-2.5 bg-muted/10">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Special request</p>
                <p className="text-sm italic text-foreground">"{order.specialRequest}"</p>
              </div>
            )}
            {order.staffNote && (
              <div className="px-3 py-2.5 bg-muted/10">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Staff note</p>
                <p className="text-sm text-foreground">{order.staffNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action footer */}
      {!terminal && (
        <div className="space-y-2 border-t border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Update status
          </p>
          <div className="flex flex-wrap gap-2">
            {isPendingApproval ? (
              <>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={approve}
                  size="sm"
                  className="text-xs gap-1.5 flex-1"
                >
                  {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Approve Order
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => reject()}
                  size="sm"
                  className="text-xs gap-1.5 flex-1"
                >
                  {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Reject Order
                </Button>
              </>
            ) : (
              <>
                {transitions
                  .filter((t) => t.toStatus !== 'Cancelled')
                  .map((t) => (
                    <Button
                      key={t.toStatus}
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (t.toStatus === 'Acknowledged') acknowledge()
                        else if (t.toStatus === 'In Progress') start()
                        else if (t.toStatus === 'Completed') complete()
                      }}
                      size="sm"
                      className="text-xs gap-1.5 flex-1"
                    >
                      {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                      {t.label}
                    </Button>
                  ))}
                {transitions.some((t) => t.toStatus === 'Cancelled') && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => setShowCancel(true)}
                    size="sm"
                    className="text-xs border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950 flex-1"
                  >
                    Cancel request
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Cancel confirm dialog */}
      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent className="max-w-sm rounded-lg">
          <AlertDialogHeader>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-center text-sm font-semibold">
              Cancel request?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs">
              Are you sure? This request will be marked as Cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" size="sm" className="text-xs flex-1">
                Keep request
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => cancel(() => setShowCancel(false))}
                className="text-xs flex-1"
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                Yes, cancel
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 p-4 pt-12">
      <Skeleton className="h-3 w-24 rounded" />
      <Skeleton className="h-6 w-48 rounded" />
      <Skeleton className="mt-4 h-16 rounded-md" />
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4, 5].map((v) => (
          <Skeleton key={v} className="h-4 rounded" />
        ))}
      </div>
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────
export function OrderDrawer() {
  const { isDrawerOpen, selectedOrderId, closeDrawer } = useUIStore()
  const { data: order, isLoading, isError } = useOrder(selectedOrderId)

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent className="w-full max-w-md p-0 flex flex-col focus-visible:outline-none">
        {isLoading ? (
          <DrawerSkeleton />
        ) : isError || !order ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive animate-pulse" />
            <p className="text-sm font-medium text-foreground">Unable to load order</p>
            <p className="text-xs text-muted-foreground">Try closing and reopening</p>
          </div>
        ) : (
          <DrawerContent order={order} />
        )}
      </SheetContent>
    </Sheet>
  )
}
