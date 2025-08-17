"use client";

import {
  User,
  Wallet,
  Shield,
  Github,
  Linkedin,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function ProfilePage() {
  const { user, logout, authenticated, ready } = usePrivy();

  const builderScore = 847;

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please Connect Your Wallet
          </h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your profile
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Go to Wallet
          </Button>
        </div>
      </div>
    );
  }

  const credentials = [
    { type: "Hackathon Winner", issuer: "ETH Global", verified: true },
    { type: "Developer Certification", issuer: "GitHub", verified: true },
    { type: "Community Badge", issuer: "Talent Protocol", verified: false },
  ];

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Profile
          </h1>
          <Button variant="ghost" size="sm" className="hover:bg-muted">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <div className="glass-card rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center glass">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {user?.email?.address?.split("@")[0] ||
                  user?.wallet?.address?.slice(0, 6) ||
                  "Anonymous Hacker"}
              </h2>
              <p className="text-muted-foreground">
                {user?.email?.address ||
                  user?.wallet?.address?.slice(0, 6) +
                    "..." +
                    user?.wallet?.address?.slice(-4) ||
                  "hacker@Hacker House Protocol.com"}
              </p>
            </div>
          </div>

          {/* Builder Score */}
          <div className="bg-primary/10 glass-card rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Builder Score</h3>
                <p className="text-sm text-muted-foreground">
                  Talent Protocol Reputation
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  {builderScore}
                </div>
                <div className="text-xs text-muted-foreground">Top 15%</div>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="border border-border glass-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Wallet</span>
              </div>
              {user?.wallet?.address ? (
                <span className="px-2 py-1 bg-chart-3/20 text-chart-3 text-xs rounded-full font-medium">
                  Connected
                </span>
              ) : (
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/login")}
                  className="gradient-primary text-primary-foreground glass"
                >
                  Connect
                </Button>
              )}
            </div>
            {user?.wallet?.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">
                  {user.wallet.address.slice(0, 6)}...
                  {user.wallet.address.slice(-4)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="hover:bg-muted"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-muted">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Credentials */}
        <div className="glass-card rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verifiable Credentials
          </h3>
          <div className="space-y-3">
            {credentials.map((credential, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border glass-card rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">
                    {credential.type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issued by {credential.issuer}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {credential.verified ? (
                    <span className="px-2 py-1 bg-chart-3/20 text-chart-3 text-xs rounded-full font-medium">
                      Verified
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs glass-card border-border bg-transparent"
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="glass-card rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Connected Accounts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border glass-card rounded-lg">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-foreground" />
                <span className="font-medium text-foreground">GitHub</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="glass-card border-border bg-transparent"
              >
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border glass-card rounded-lg">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-foreground" />
                <span className="font-medium text-foreground">LinkedIn</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="glass-card border-border bg-transparent"
              >
                Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 glass-card bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <BottomNavigation activeTab="Profile" />
    </div>
  );
}
