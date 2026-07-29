/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MSW: string
  readonly VITE_SIMULATE_LATENCY_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
