"use client";

import { usePrivy, getAccessToken } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceData {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
  name: string;
  network: string;
}

export default function WalletBalance() {
  const { user, authenticated } = usePrivy();
  const [balances, setBalances] = useState<BalanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!authenticated || !user?.wallet?.address) {
      setBalances([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const walletAddress = user.wallet.address;
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch("/api/wallet/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          walletAddress,
          network: "ethereum", // You can make this configurable
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch balances");
      }

      const result = await response.json();
      setBalances(result.data.tokens);
    } catch (err) {
      setError("Failed to fetch balances");
      console.error("Error fetching balances:", err);
    } finally {
      setLoading(false);
    }
  }, [authenticated, user?.wallet?.address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  if (!authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect your wallet to view balances
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            NOW Token Balance
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBalances}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {user.wallet?.address && (
            <span>
              Wallet: {user.wallet.address.slice(0, 6)}...
              {user.wallet.address.slice(-4)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : balances.length === 0 ? (
          <div className="text-muted-foreground text-sm">No tokens found</div>
        ) : (
          <div className="space-y-3">
            {balances.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{token.symbol}</Badge>
                  <div className="text-left">
                    <div className="font-medium">{token.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {token.network} • {token.address.slice(0, 6)}...
                      {token.address.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{token.balance}</div>
                  <div className="text-xs text-muted-foreground">
                    {token.decimals} decimals
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
