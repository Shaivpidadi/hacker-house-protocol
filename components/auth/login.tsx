"use client";

import React from "react";
import Image from "next/image";

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
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image0.jpg"
          alt="HackerHouse Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-900/80"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center relative z-10">
        {/* Show user info if already connected */}
        {authenticated && user && (
          <div className="mb-8 p-6 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30 w-full shadow-xl">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-green-400 mb-2">
                Wallet Connected!
              </h2>
              <p className="text-sm text-green-300 mb-3">
                {user.wallet?.address
                  ? `${user.wallet.address.slice(
                      0,
                      6
                    )}...${user.wallet.address.slice(-4)}`
                  : "Wallet connected successfully"}
              </p>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="border-green-400/50 text-green-400 hover:bg-green-500/20 bg-white/10"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {ready && !authenticated && (
        <div className="px-6 pb-8 relative z-10">
          <div className="space-y-4">
            {/* Log In Button */}
            <Button
              onClick={login}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl border-2 border-purple-400/30 shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              Log In
            </Button>

            {/* Sign Up Button */}
            <Button
              onClick={login}
              className="w-full h-14 bg-gray-800/80 hover:bg-gray-700/80 text-white text-lg font-bold rounded-xl border-2 border-purple-400/30 shadow-2xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
