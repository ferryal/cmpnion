import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardMetrics } from '@entities/dashboard/api/queries/useDashboardMetrics'
import type { DashboardMetrics } from '@entities/dashboard/model/types'
import { useOrders } from '@entities/order/api/queries/useOrders'
import { formatUSD } from '@shared/lib/currency'
import { formatRelative } from '@shared/lib/date'
import { isSlaBreached } from '@shared/lib/sla'
import { useUIStore } from '@shared/store/uiStore'
import { ServiceIcon } from '@shared/ui/icons/ServiceIcon'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CHART_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1']

// ─── Metric Card ──────────────────────────────────────────────
function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  description,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  loading?: boolean
  description?: string
}) {
  if (loading) {
    return (
      <Card className="border-border/80 bg-card">
        <CardHeader className="p-4 pb-2 space-y-1.5">
          <Skeleton className="h-3 w-16 rounded" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-6 w-12 rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-sm hover:border-border/80 transition-colors">
      <CardHeader className="p-4 pb-1.5 flex flex-row items-center justify-between space-y-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Service breakdown chart ─────────────────────────────────
function ServiceChart({ metrics, loading }: { metrics?: DashboardMetrics; loading?: boolean }) {
  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-4 w-28 rounded" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-40 w-full rounded" />
        </CardContent>
      </Card>
    )
  }

  const data =
    metrics?.topServices.map((s) => ({
      name: s.service.replace(' & ', ' &\n'),
      count: s.count,
    })) ?? []

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Request Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Orders requested across service categories
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: 'currentColor' }}
              className="text-muted-foreground font-medium"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'currentColor' }}
              className="text-muted-foreground font-medium"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--popover-foreground))',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ fill: 'hsl(var(--accent))' }}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={32}>
              {data.map((item, i) => (
                <Cell key={item.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ─── Service list ────────────────────────────────────────────
function ServiceList({ metrics, loading }: { metrics?: DashboardMetrics; loading?: boolean }) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Popular Services
        </CardTitle>
        <CardDescription className="text-xs">Top requested categories by volume</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-3.5">
            {[1, 2, 3, 4, 5].map((v) => (
              <div key={v} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="mb-1.5 h-3 w-24 rounded" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3.5">
            {metrics?.topServices.map((entry, i) => {
              const max = metrics.topServices[0]?.count ?? 1
              const pct = Math.round((entry.count / max) * 100)
              return (
                <div key={entry.service} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
                    <ServiceIcon
                      service={entry.service}
                      className="h-4 w-4 text-muted-foreground"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {entry.service}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2 shrink-0 text-[10px] font-semibold px-1 py-0 h-4"
                      >
                        {entry.count} req
                      </Badge>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Attention Board ──────────────────────────────────────────
function AttentionBoard() {
  const { data } = useOrders({ limit: 15 })
  const openDrawer = useUIStore((s) => s.openDrawer)
  const orders = data?.data ?? []

  const criticalOrders = orders
    .filter((o) => isSlaBreached(o.orderTime, o.status) || o.paymentStatus === 'Failed')
    .slice(0, 3)

  if (criticalOrders.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Operational Alerts
          </CardTitle>
          <CardDescription className="text-xs">Action items requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center justify-center py-6 text-center">
          <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-foreground">All systems clear</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            No SLA breaches or failed payments.
          </span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-sm border-amber-200/60 dark:border-amber-950/40 bg-amber-50/5">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            Critical Alerts ({criticalOrders.length})
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-amber-600 dark:text-amber-500">
          Immediate response or payment correction needed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {criticalOrders.map((o) => {
          const isFailedPayment = o.paymentStatus === 'Failed'
          const isBreach = isSlaBreached(o.orderTime, o.status)

          return (
            <button
              key={o.id}
              type="button"
              onClick={() => openDrawer(o.id)}
              className="flex w-full items-center justify-between p-2.5 rounded-md border border-border bg-card hover:bg-accent/40 cursor-pointer transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 font-semibold">
                    Room {o.roomNumber}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-foreground truncate mt-0.5">
                  {o.guestName}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <ServiceIcon service={o.service} className="h-3 w-3" />
                  {o.service}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1.5">
                {isBreach && (
                  <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 text-[9px] font-semibold h-4">
                    SLA Breached
                  </Badge>
                )}
                {isFailedPayment && (
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 text-[9px] font-semibold h-4">
                    Payment Failed
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground">
                  {formatRelative(o.orderTime)}
                </span>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

// ─── Recent Active Queue ──────────────────────────────────────
function RecentQueue() {
  const { data } = useOrders({ limit: 4 })
  const openDrawer = useUIStore((s) => s.openDrawer)
  const orders = data?.data ?? []

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Request Feed
          </CardTitle>
          <CardDescription className="text-xs">Most recent operations requests</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const navigate = useUIStore.getState().closeDrawer
            navigate() // close drawer and let routing take over
          }}
          className="text-xs h-7 text-primary hover:text-primary/80 font-semibold gap-1"
        >
          View queue
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <div className="divide-y divide-border/60">
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => openDrawer(o.id)}
              className="flex w-full items-center justify-between py-2.5 hover:bg-accent/20 cursor-pointer px-1 rounded transition-colors text-left"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">{o.guestName}</span>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 font-medium">
                    {o.roomNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
                  <ServiceIcon service={o.service} className="h-3 w-3" />
                  <span>{o.service}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground">
                  {formatRelative(o.orderTime)}
                </span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {formatUSD(o.amount)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Dashboard Overview ──────────────────────────────────
export function DashboardKpi() {
  const { data: metrics, isLoading, isError, refetch } = useDashboardMetrics()

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16 text-center">
        <AlertCircle className="mb-3 h-8 w-8 text-destructive animate-bounce" />
        <p className="mb-1 text-sm font-semibold text-foreground">Unable to load metrics</p>
        <p className="mb-4 text-xs text-muted-foreground">Check your connection and try again</p>
        <Button type="button" onClick={() => refetch()} size="sm" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 2-Column Grid: Left (Metrics + Chart), Right (Alerts + Feed) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column (Span 2): Operational & Financial Overview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Operational Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricCard
              label="Active Guests"
              value={metrics?.activeGuests ?? 0}
              icon={Users}
              loading={isLoading}
              description="Guests with ongoing requests"
            />
            <MetricCard
              label="Pending Orders"
              value={metrics?.pendingOrders ?? 0}
              icon={ShoppingCart}
              loading={isLoading}
              description="Awaiting processing"
            />
            <MetricCard
              label="Completed Today"
              value={metrics?.completedOrders ?? 0}
              icon={CheckCircle2}
              loading={isLoading}
              description="Resolved service requests"
            />
          </div>

          {/* Financial Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MetricCard
              label="Revenue Today"
              value={formatUSD(metrics?.revenueToday ?? 0)}
              icon={DollarSign}
              loading={isLoading}
              description="Total completed service sales"
            />
            <MetricCard
              label="Average Order Value"
              value={formatUSD(metrics?.averageOrderValue ?? 0)}
              icon={TrendingUp}
              loading={isLoading}
              description="Mean billing per guest request"
            />
          </div>

          {/* Chart & Ranking distribution */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ServiceChart metrics={metrics} loading={isLoading} />
            <ServiceList metrics={metrics} loading={isLoading} />
          </div>
        </div>

        {/* Right Column (Span 1): Live feed and alerts board */}
        <div className="space-y-4">
          {/* SLA & Payment alert notifications */}
          <AttentionBoard />

          {/* Live Request Queue */}
          <RecentQueue />
        </div>
      </div>
    </div>
  )
}
