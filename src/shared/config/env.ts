export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) ?? '/api',
  enableMsw: import.meta.env.VITE_ENABLE_MSW === 'true',
  simulateLatencyMs: Number(import.meta.env.VITE_SIMULATE_LATENCY_MS ?? 500),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
