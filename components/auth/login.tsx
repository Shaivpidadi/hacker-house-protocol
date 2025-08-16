"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export function Login() {
  const { login, ready, authenticated, user } = usePrivy();
  const router = useRouter();

  // Redirect to main page if already authenticated
  React.useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center glass shadow-lg">
            <span className="text-primary-foreground text-2xl font-bold">
              CR
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            Connect Your Wallet
          </h1>
          <p className="text-muted-foreground">
            Connect your wallet to access CryptoReal
          </p>
        </div>

        {/* Wallet Connect Section */}
        {ready && !authenticated && (
          <div className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Quick Wallet Login
              </h2>
              <p className="text-sm text-muted-foreground">
                Connect your wallet for instant access
              </p>
            </div>
            <Button
              onClick={login}
              className="w-full h-12 gradient-primary hover:opacity-90 text-primary-foreground rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-[1.02] glass shadow-lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Show user info if already connected */}
        {authenticated && user && (
          <div className="mb-8 p-6 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-600 mb-2">
                Wallet Connected!
              </h2>
              <p className="text-sm text-green-600/80 mb-3">
                {user.wallet?.address
                  ? `${user.wallet.address.slice(
                      0,
                      6
                    )}...${user.wallet.address.slice(-4)}`
                  : "Wallet connected successfully"}
              </p>
              <Button
                onClick={() => router.push("/wallet")}
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-600 hover:bg-green-500/10"
              >
                Go to Wallet Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
