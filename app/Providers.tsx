'use client';

import { HypergraphAppProvider, HypergraphSpaceProvider } from '@graphprotocol/hypergraph-react';

import { mapping } from './mapping';

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const _storage = typeof window !== 'undefined' ? window.localStorage : (undefined as unknown as Storage);

  // get environment variables with fallbacks
  const appId = process.env.NEXT_PUBLIC_HYPERGRAPH_APP_ID || '93bb8907-085a-4a0e-83dd-62b0dc98e793';
  const privateSpaceId = process.env.NEXT_PUBLIC_HYPERGRAPH_PRIVATE_SPACE_ID || 'f8e2f826-6068-46a8-8760-8dd8680792bd';

  return (
    <HypergraphAppProvider mapping={mapping} storage={_storage} appId={appId}>
      <HypergraphSpaceProvider space={privateSpaceId}>
        {children}
      </HypergraphSpaceProvider>
    </HypergraphAppProvider>
  );
}
