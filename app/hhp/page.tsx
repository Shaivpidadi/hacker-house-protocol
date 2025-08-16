import { Metadata } from "next";
import HhpActions from "@/components/hhp-actions";
import ReservationManager from "@/components/reservation-manager";
import PrivyGuard from "@/components/privy-guard";

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
