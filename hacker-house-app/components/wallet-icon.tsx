"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Wallet, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface WalletIconProps {
  showStatus?: boolean;
  showAddress?: boolean;
  className?: string;
}

export default function WalletIcon({
  showStatus = true,
  showAddress = false,
  className = "",
}: WalletIconProps) {
  const { ready, authenticated, user } = usePrivy();

  if (!ready) {
    return (
      <div className={`animate-pulse ${className}`}>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Link href="/login">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${className}`}
        >
          <Wallet className="h-5 w-5" />
          {showStatus && <span className="text-sm">Connect</span>}
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/login">
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
      >
        <div className="relative">
          <Wallet className="h-5 w-5" />
          {showStatus && (
            <div className="absolute -top-1 -right-1">
              <CheckCircle className="h-3 w-3 text-green-500 fill-current" />
            </div>
          )}
        </div>
        {showStatus && <span className="text-sm">Connected</span>}
        {showAddress && user?.wallet?.address && (
          <Badge variant="secondary" className="text-xs">
            {user.wallet.address.slice(0, 4)}...{user.wallet.address.slice(-4)}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
