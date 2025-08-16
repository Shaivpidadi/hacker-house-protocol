"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Github, Chrome, Apple } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("demo@cryptoreal.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const { login, ready, authenticated, user } = usePrivy();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, we'll use a mock login since we're only using Privy for wallet auth
      // In the future, you can integrate this with your backend auth system
      console.log("Traditional login attempted with:", { email, password });

      // Simulate successful login
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold mb-2 text-foreground">Login</h1>
          <p className="text-muted-foreground">
            Please enter your details below
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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Connect Wallet
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

        {/* Divider */}
        {ready && (
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use traditional login
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-lg border-border bg-input glass-card transition-all duration-200 focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-border bg-input glass-card pr-12 transition-all duration-200 focus:ring-2 focus:ring-ring"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-auto p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="#"
              className="text-sm text-accent hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 gradient-primary hover:opacity-90 text-primary-foreground rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 glass shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Or Continue With</p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full hover:scale-110 transition-transform glass-card border-border bg-transparent"
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full hover:scale-110 transition-transform glass-card border-border bg-transparent"
              >
                <Chrome className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full hover:scale-110 transition-transform glass-card border-border bg-transparent"
              >
                <Apple className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-accent hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
