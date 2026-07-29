export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: (hotelId?: string) => ['dashboard', 'metrics', hotelId] as const,
}
