import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from './providers/QueryProvider'
import { AppRouter } from './router'
import '../styles/globals.css'

async function prepare() {
  if (import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('../mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

prepare().then(() => {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element not found')

  createRoot(rootEl).render(
    <StrictMode>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </StrictMode>
  )
})
