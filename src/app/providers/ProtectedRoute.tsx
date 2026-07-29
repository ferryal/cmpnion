import { useAuthStore } from '@shared/store/authStore'
import { Navigate, useLocation } from 'react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
