"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";

interface PrivyGuardProps {
  children: React.ReactNode;
}

export default function PrivyGuard({ children }: PrivyGuardProps) {
  const { ready, authenticated, login } = usePrivy();

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Initializing wallet connection...
          </p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <p className="text-muted-foreground mt-2">
              Connect your wallet to access the wallet dashboard and manage your
              NOW tokens
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              className="w-full flex items-center gap-2"
              size="lg"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have a wallet? We'll create one for you!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
