"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Welcome() {
  const { user, authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated && user) {
      router.push("/");
    }
  }, [ready, authenticated, user, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo/Avatar */}
        <div className="w-32 h-32 gradient-primary rounded-full mb-12 flex items-center justify-center shadow-2xl glass">
          <span className="text-primary-foreground text-4xl font-bold">CR</span>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Welcome to
          </h1>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            CryptoReal
          </h1>
          <p className="text-muted-foreground mt-4">
            Your crypto rental & co-pay platform
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full h-14 gradient-primary hover:opacity-90 text-primary-foreground rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg glass">
              Log In
            </Button>
          </Link>
          <Link href="/signup" className="block">
            <Button
              variant="outline"
              className="w-full h-14 border-2 border-border text-foreground hover:bg-muted rounded-lg text-lg font-medium glass-card transition-all duration-300 transform hover:scale-[1.02] bg-transparent"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
