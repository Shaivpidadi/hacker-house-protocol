"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Plus,
  Link,
  Unlink,
  Mail,
  Phone,
  MessageCircle,
  User,
  Shield,
} from "lucide-react";

export default function WalletManager() {
  const {
    ready,
    authenticated,
    user,
    linkWallet,
    unlinkWallet,
    linkEmail,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  if (!ready) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!authenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect your wallet to manage accounts
          </p>
        </CardContent>
      </Card>
    );
  }

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;
  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Management
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Manage your connected accounts and wallets
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </h3>
          {wallet ? (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Connected</Badge>
                <span className="font-mono text-sm">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkWallet(wallet.address)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            </div>
          ) : (
            <Button onClick={linkWallet} className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>

        <Separator />

        {/* Email Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </h3>
          {email ? (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Connected</Badge>
                <span className="text-sm">{email.address}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkEmail(email.address)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            </div>
          ) : (
            <Button
              onClick={linkEmail}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Connect Email
            </Button>
          )}
        </div>

        <Separator />

        {/* Phone Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </h3>
          {phone ? (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Connected</Badge>
                <span className="text-sm">{phone.number}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkPhone(phone.number)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            </div>
          ) : (
            <Button
              onClick={linkPhone}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              Connect Phone
            </Button>
          )}
        </div>

        <Separator />

        {/* Social Accounts Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Social Accounts
          </h3>

          {/* Google */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant={googleSubject ? "secondary" : "outline"}>
                {googleSubject ? "Connected" : "Not Connected"}
              </Badge>
              <span className="text-sm">Google</span>
            </div>
            {googleSubject ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkGoogle(googleSubject)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            ) : (
              <Button
                onClick={linkGoogle}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Connect
              </Button>
            )}
          </div>

          {/* Twitter */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant={twitterSubject ? "secondary" : "outline"}>
                {twitterSubject ? "Connected" : "Not Connected"}
              </Badge>
              <span className="text-sm">Twitter</span>
            </div>
            {twitterSubject ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkTwitter(twitterSubject)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            ) : (
              <Button
                onClick={linkTwitter}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Connect
              </Button>
            )}
          </div>

          {/* Discord */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant={discordSubject ? "secondary" : "outline"}>
                {discordSubject ? "Connected" : "Not Connected"}
              </Badge>
              <span className="text-sm">Discord</span>
            </div>
            {discordSubject ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => unlinkDiscord(discordSubject)}
                disabled={!canRemoveAccount}
                className="flex items-center gap-2"
              >
                <Unlink className="h-4 w-4" />
                Unlink
              </Button>
            ) : (
              <Button
                onClick={linkDiscord}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Connect
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Account Info */}
        <div className="text-sm text-muted-foreground">
          <p>Total linked accounts: {numAccounts}</p>
          {!canRemoveAccount && (
            <p className="text-amber-600 mt-1">
              You need at least 2 accounts to unlink any of them
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
