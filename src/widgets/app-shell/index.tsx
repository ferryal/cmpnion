import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { track } from '@shared/lib/analytics'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/store/authStore'
import { useDevStore } from '@shared/store/devStore'
import { useTenantStore } from '@shared/store/tenantStore'
import { useUIStore } from '@shared/store/uiStore'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart2,
  BellDot,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShieldAlert,
  Sun,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { DevPanel } from './DevPanel'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList, end: false },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { hotels, currentHotelId, switchHotel } = useTenantStore()
  const { staff } = useAuthStore()

  const handleHotelChange = (id: string) => {
    switchHotel(id)
    track('hotel_switched', { hotelId: id })
    toast.success(`Switched to property: ${hotels.find((h) => h.id === id)?.name}`)
    if (onClose) onClose()
  }

  const staffInitials = staff?.name
    ? staff.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'SF'

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-foreground">
          <BarChart2 className="h-4 w-4 text-sidebar" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          CMPNION
        </span>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto h-7 w-7 rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Property Selector - Multi-tenancy */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Current Property
        </span>
        <Select value={currentHotelId} onValueChange={handleHotelChange}>
          <SelectTrigger className="h-9 text-xs border-sidebar-border bg-sidebar hover:bg-sidebar-accent focus:ring-0 text-left focus:ring-offset-0">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            {hotels.map((h) => (
              <SelectItem key={h.id} value={h.id} className="text-xs">
                <div className="font-medium">{h.name}</div>
                <div className="text-[10px] text-muted-foreground">{h.brand}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Menu
        </p>
        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Info footer */}
      <div className="border-t border-sidebar-border p-3 bg-sidebar-accent/20">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <Avatar className="h-8 w-8 border border-sidebar-border">
            <AvatarFallback className="bg-sidebar-accent-foreground text-sidebar text-xs font-semibold">
              {staffInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {staff?.name ?? 'Staff User'}
            </p>
            <p className="truncate text-[10px] text-muted-foreground capitalize">
              {staff?.role ?? 'Front Desk'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme, isDevPanelOpen, toggleDevPanel } = useUIStore()
  const { logout, staff } = useAuthStore()
  const { simulateNewOrders, simulateErrors } = useDevStore()
  const navigate = useNavigate()

  // 1. Keyboard shortcut for Dev Panel (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleDevPanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleDevPanel])

  // 2. Real-time new order simulation background task
  useEffect(() => {
    if (!simulateNewOrders) return

    const interval = setInterval(async () => {
      // Simulate post request to create new order
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: 'Random Guest',
            roomNumber: String(Math.floor(Math.random() * 800) + 100),
            service: ['Room Service', 'Housekeeping', 'Laundry'][Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 120),
          }),
        })
        if (res.ok) {
          const newOrder = await res.json()
          toast.info(`New request from Room ${newOrder.roomNumber}!`, {
            description: `${newOrder.service} requested by ${newOrder.guestName}`,
            action: {
              label: 'View',
              onClick: () => {
                useUIStore.getState().openDrawer(newOrder.id)
                navigate('/orders')
              },
            },
          })
        }
      } catch (err) {
        console.error('Failed to simulate new order', err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [simulateNewOrders, navigate])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  const staffInitials = staff?.name
    ? staff.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'SF'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block h-full">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 z-50 h-full w-56 shadow-xl lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 justify-between">
          {/* Mobile menu */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="rounded-md h-9 w-9 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 animate-fade-in">
            {/* Simulation Active Badge */}
            {simulateNewOrders && (
              <Badge
                variant="outline"
                className="text-[9px] gap-1 px-1.5 py-0.5 border-orange-200 bg-orange-50 text-orange-700 animate-pulse hidden sm:inline-flex rounded-md"
              >
                <ShieldAlert className="h-2.5 w-2.5 text-orange-600" />
                Simulation: Active
              </Badge>
            )}

            {/* API Errors Active Badge */}
            {simulateErrors && (
              <Badge
                variant="outline"
                className="text-[9px] gap-1 px-1.5 py-0.5 border-red-200 bg-red-50 text-red-700 animate-pulse hidden sm:inline-flex rounded-md"
              >
                <AlertTriangle className="h-2.5 w-2.5 text-red-600" />
                API Errors: Active
              </Badge>
            )}

            {/* Theme toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Notifications"
            >
              <BellDot className="h-4 w-4" />
            </Button>

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0 border border-border"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {staffInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {staff?.name ?? 'Staff User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {staff?.email ?? 'staff@cmpnion.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDevPanel} className="cursor-pointer text-xs">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>Developer Panel</span>
                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                    Ctrl+Shift+D
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-xs text-red-600 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Developer panel shortcut banner */}
        <div className="bg-muted/40 border-b border-border/80 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">🛠️ Developer Controls Enabled</span>
            <span>•</span>
            <span>Simulate mock API issues or real-time orders directly.</span>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={toggleDevPanel}
            className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-semibold"
          >
            Open Panel (Ctrl+Shift+D) →
          </Button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Dev Panel Overlay */}
      <DevPanel open={isDevPanelOpen} onClose={toggleDevPanel} />
    </div>
  )
}
