import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { dashboardKeys } from '@entities/dashboard/api/queries/queryKeys'
import { orderKeys } from '@entities/order/api/queries/queryKeys'
import { useDevStore } from '@shared/store/devStore'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DevPanelProps {
  open: boolean
  onClose: () => void
}

export function DevPanel({ open, onClose }: DevPanelProps) {
  const { simulateErrors, toggleErrorSimulation, simulateNewOrders, toggleNewOrderSimulation } =
    useDevStore()
  const queryClient = useQueryClient()

  // Simulate a new order arrival instantly
  const triggerNewOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: 'Dev Guest',
          roomNumber: String(Math.floor(Math.random() * 800) + 100),
          service: 'Room Service',
          amount: 55,
        }),
      })
      if (res.ok) {
        const order = await res.json()
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
        toast.info(`Dev new order triggered: ${order.id}!`, {
          description: `Room ${order.roomNumber} requested Room Service.`,
        })
      }
    } catch (_err) {
      toast.error('Failed to trigger new order')
    }
  }

  // Force SLA breach by inserting an older order
  const triggerSlaBreach = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: 'SLA Breach Guest',
          roomNumber: '999',
          service: 'Spa & Massage',
          amount: 150,
          // Explicitly older timestamp
          orderTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        }),
      })
      if (res.ok) {
        const order = await res.json()
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
        toast.warning(`SLA breach triggered: ${order.id}!`, {
          description: 'This order exceeds 15 minutes in New status.',
        })
      }
    } catch (_err) {
      toast.error('Failed to trigger SLA breach')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full max-w-sm p-6 flex flex-col focus-visible:outline-none">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-sm font-semibold">Developer Panel</SheetTitle>
          <SheetDescription className="text-xs">
            Toggle simulations and force error states to test the frontend behavior.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 flex-1">
          {/* Simulation Toggles */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Simulations
            </h4>
            <div className="flex items-center justify-between gap-4 py-2 border-b border-border/40">
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs font-semibold cursor-pointer" htmlFor="error-toggle">
                  Simulate API Errors
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  Returns 500 on 10% of order list loads
                </span>
              </div>
              <Switch
                id="error-toggle"
                checked={simulateErrors}
                onCheckedChange={toggleErrorSimulation}
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2 border-b border-border/40">
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs font-semibold cursor-pointer" htmlFor="new-order-toggle">
                  Real-time New Orders
                </Label>
                <span className="text-[10px] text-muted-foreground">
                  Triggers new guest requests every 30 seconds
                </span>
              </div>
              <Switch
                id="new-order-toggle"
                checked={simulateNewOrders}
                onCheckedChange={toggleNewOrderSimulation}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h4>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={triggerNewOrder}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                ⚡ Trigger New Order Instantly
              </Button>
              <Button
                type="button"
                onClick={triggerSlaBreach}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                ⏰ Force SLA Breach Order
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
