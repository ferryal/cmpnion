import { AppShell } from '@widgets/app-shell'
import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { ProtectedRoute } from './providers/ProtectedRoute'

const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'))
const OrdersPage = lazy(() => import('@pages/orders/OrdersPage'))
const LoginPage = lazy(() => import('@pages/login/LoginPage'))
const NotFoundPage = lazy(() => import('@pages/not-found/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrdersPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
