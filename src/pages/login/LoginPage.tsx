import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@shared/store/authStore'
import { Loader2, Lock, Mail } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-border shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold">Sign in to CMPNION</CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials to access the Hotel Service Management Dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="front@cmpnion.com"
                  className="pl-9 text-xs h-9 bg-background focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('register' in errors ? 'email' : 'email')}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
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

            <div className="rounded-md border border-border/80 bg-muted/30 p-2.5 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Tip:</span> Use{' '}
              <code className="rounded bg-muted px-1 font-mono">front@cmpnion.com</code> and{' '}
              <code className="rounded bg-muted px-1 font-mono">password</code> to sign in.
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full text-xs h-9">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
