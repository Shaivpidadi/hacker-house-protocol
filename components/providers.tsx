"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  // Check if required environment variables are set
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

  // Debug: Log what we're getting
  console.log("🔍 Privy Environment Debug:");
  console.log("NEXT_PUBLIC_PRIVY_APP_ID:", appId);
  console.log("NEXT_PUBLIC_PRIVY_CLIENT_ID:", clientId);
  console.log(
    "Environment type:",
    typeof window === "undefined" ? "Server" : "Client"
  );

  if (!appId || !clientId) {
    console.error("❌ Missing Privy environment variables:");
    console.error("NEXT_PUBLIC_PRIVY_APP_ID:", appId);
    console.error("NEXT_PUBLIC_PRIVY_CLIENT_ID:", clientId);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Configuration Error
          </h1>
          <p className="text-muted-foreground mb-4">
            Privy environment variables are not configured properly.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm">
            <p className="font-medium mb-2">
              Please create a <code>.env.local</code> file with:
            </p>
            <pre className="bg-background p-2 rounded text-xs">
              {`NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_client_id_here
PRIVY_APP_SECRET=your_app_secret_here`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={appId}
        clientId={clientId}
        config={{
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
