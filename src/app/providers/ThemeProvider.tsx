import { useUIStore } from '@shared/store/uiStore'
import { useEffect } from 'react'

/** Syncs persisted theme to <html> class on first mount */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
