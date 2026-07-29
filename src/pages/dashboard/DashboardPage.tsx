import { DashboardKpi } from '@widgets/dashboard-kpi'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-screen-xl p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Hotel operations overview</p>
      </div>

      <DashboardKpi />
    </div>
  )
}
