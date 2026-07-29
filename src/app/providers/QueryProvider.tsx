import { queryClient } from '@shared/config/queryClient'
import { useUIStore } from '@shared/store/uiStore'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from './ThemeProvider'

interface QueryProviderProps {
  children: ReactNode
}

function ToasterBridge() {
  const theme = useUIStore((s) => s.theme)
  return <Toaster position="top-right" richColors closeButton theme={theme} />
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ToasterBridge />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
