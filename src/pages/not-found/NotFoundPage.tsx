import { ArrowLeft, Hotel } from 'lucide-react'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Hotel className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-2 text-6xl font-black text-foreground">404</h1>
      <h2 className="mb-3 text-xl font-semibold text-foreground">Page not found</h2>
      <p className="mb-8 max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
