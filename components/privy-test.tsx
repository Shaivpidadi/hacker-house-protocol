"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivyTest() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Privy Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <div>
            <strong>Ready:</strong> {ready ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Authenticated:</strong> {authenticated ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || "None"}
          </div>
          <div>
            <strong>Wallet:</strong>{" "}
            {user?.wallet?.address ? "✅ Connected" : "❌ Not Connected"}
          </div>
        </div>

        <div className="space-y-2">
          {!authenticated ? (
            <Button onClick={login} className="w-full">
              Test Login
            </Button>
          ) : (
            <Button onClick={logout} variant="outline" className="w-full">
              Test Logout
            </Button>
          )}
        </div>

        {user && (
          <div className="text-xs bg-muted p-2 rounded">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
