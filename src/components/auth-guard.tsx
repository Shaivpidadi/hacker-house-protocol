import { useAuthStatus } from '@/lib/auth';
import { Link } from '@tanstack/react-router';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const authStatus = useAuthStatus();

  // show loading state while initializing
  if (authStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if authentication is required but user is not authenticated
  if (requireAuth && authStatus === 'unauthenticated') {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-6">
            You need to sign in to access this feature. Please authenticate to continue.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // if authentication is not required but user is authenticated, show different content
  if (!requireAuth && authStatus === 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You are already signed in.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // render children if authentication requirements are met
  return <>{children}</>;
}
