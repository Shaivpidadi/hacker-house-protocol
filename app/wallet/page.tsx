import { Metadata } from "next";
import WalletLogin from "@/components/wallet-login";
import WalletBalance from "@/components/wallet-balance";
import WalletManager from "@/components/wallet-manager";
import PrivyTest from "@/components/privy-test";
import PrivyGuard from "@/components/privy-guard";

export const metadata: Metadata = {
  title: "Wallet Dashboard - CryptoReal",
  description: "Manage your wallet, view balances, and connect accounts",
};

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Connect your wallet, view NOW token balances, and manage your accounts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Wallet Login Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <WalletLogin />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PrivyTest />
          <WalletBalance />
          <WalletManager />
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About NOW Tokens</h2>
        <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">
              What are NOW tokens?
            </h3>
            <p>
              NOW tokens are the native utility tokens used within the
              CryptoReal ecosystem for payments, rewards, and governance.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">
              How to get NOW tokens?
            </h3>
            <p>
              You can earn NOW tokens by participating in the platform,
              completing rentals, or purchasing them through supported
              exchanges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
