import { useHypergraphAuth, useSpaces } from '@graphprotocol/hypergraph-react';

// authentication status types
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

// hook to check authentication status
export function useAuthStatus(): AuthStatus {
  const { authenticated } = useHypergraphAuth();
  
  return authenticated ? 'authenticated' : 'unauthenticated';
}

// hook to get user information
export function useUserInfo() {
  const { authenticated } = useHypergraphAuth();
  return authenticated ? { id: 'user', name: 'User' } : null;
}

// utility function to check if user can publish to a space
export function useCanPublish(spaceId?: string) {
  const { data: spaces } = useSpaces({ mode: 'public' });
  const { authenticated } = useHypergraphAuth();
  
  if (!authenticated || !spaceId) {
    return false;
  }
  
  // check if user has access to the space
  const space = spaces?.find((s: { id: string }) => s.id === spaceId);
  return space !== undefined;
}

// authentication guard component props
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

// authentication guard hook
export function useAuthGuard(requireAuth: boolean = true) {
  const authStatus = useAuthStatus();
  
  if (requireAuth && authStatus === 'unauthenticated') {
    return { isAuthorized: false, authStatus };
  }
  
  return { isAuthorized: true, authStatus };
}
