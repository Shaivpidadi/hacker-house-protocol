"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

export default function WalletLogin() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  if (!ready) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Button onClick={login} className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-muted-foreground">
        {user?.wallet?.address ? (
          <span>
            {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
          </span>
        ) : (
          <span>Connected</span>
        )}
      </div>
      <Button
        variant="outline"
        onClick={logout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
}
