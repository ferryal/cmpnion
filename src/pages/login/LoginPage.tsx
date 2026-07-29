import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@shared/store/authStore'
import { BarChart2, CheckCircle2, Loader2, Lock, Mail, ShieldAlert, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'front@cmpnion.com',
      password: 'password',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    try {
      const success = await login(values.email, values.password)
      if (success) {
        toast.success('Welcome back to CMPNION!')
        navigate('/')
      } else {
        toast.error('Invalid email or password')
      }
    } catch (_err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left panel - Brand Showcase (visible on large screen) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-muted/30 border-r border-border p-12 relative overflow-hidden">
        {/* Subtle geometric pattern/grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <BarChart2 className="h-4.5 w-4.5 text-background" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">CMPNION</span>
        </div>

        {/* Content details */}
        <div className="max-w-md my-auto space-y-6 z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            Hotel Service Management Dashboard.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Monitor, manage, and process guest service requests in real time. Coordinate front-desk
            operations, track SLAs, and verify payments from a single unified workspace.
          </p>

          <div className="space-y-4 pt-4 border-t border-border/80">
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Operational Queue Management
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Acknowledge, process, and resolve requests instantly through a clean status
                  timeline.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 mt-0.5">
                <ShieldAlert className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Real-time SLA Highlights</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Identify pending requests older than 15 minutes immediately via pulsing visual
                  warnings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 mt-0.5">
                <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Multi-Tenancy Property Switcher
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Filter operations and KPIs isolated by hotel brand context in real time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-muted-foreground z-10">
          &copy; {new Date().getFullYear()} CMPNION Hospitality. All rights reserved.
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="space-y-1.5 text-center lg:text-left">
            {/* Small Brand Logo (visible on mobile) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground mx-auto lg:mx-0 mb-4 lg:hidden">
              <BarChart2 className="h-4.5 w-4.5 text-background" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access the CMPNION workspace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="front@cmpnion.com"
                  className="pl-9 text-xs h-9 bg-background focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 text-xs h-9 bg-background focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full text-xs h-9 mt-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Guide tip block */}
          <div className="rounded-lg border border-border bg-muted/20 p-3.5 text-xs text-muted-foreground space-y-1.5">
            <span className="font-semibold text-foreground">Operational Demo Access:</span>
            <div className="space-y-1">
              <p className="text-[11px] leading-relaxed">
                Email:{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  front@cmpnion.com
                </code>
              </p>
              <p className="text-[11px] leading-relaxed">
                Password:{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">password</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
