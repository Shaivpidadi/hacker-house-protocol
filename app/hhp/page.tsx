import { Metadata } from "next";
import HhpActions from "@/components/hhp-actions";
import ReservationManager from "@/components/reservation-manager";
import PrivyGuard from "@/components/privy-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HHP Protocol - CryptoReal",
  description: "Interact with the Hacker House Protocol smart contract",
};

export default function HhpPage() {
  return (
    <PrivyGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">HHP Protocol</h1>
          <p className="text-muted-foreground mt-2">
            Interact with the Hacker House Protocol smart contract to create
            reservations, fund them, add guests, and manage your bookings.
          </p>
        </div>

        <HhpActions />

        <ReservationManager />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/explore">Browse Listings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/explore">Search Properties</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learn More</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="https://docs.privy.io/" target="_blank">
                  Privy Documentation
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://docs.ethers.org/" target="_blank">
                  Ethers.js Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Protocol Information */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About HHP Protocol</h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">What is HHP?</h3>
              <p>
                The Hacker House Protocol (HHP) is a decentralized protocol for
                managing short-term accommodations and hackathon housing. It
                enables trustless booking and payment through smart contracts.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">How it works</h3>
              <p>
                Users can create reservations, fund them with tokens, add
                guests, and builders can withdraw funds once reservations are
                completed. All transactions are secured by blockchain
                technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PrivyGuard>
  );
}
