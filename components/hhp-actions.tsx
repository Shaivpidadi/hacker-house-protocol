"use client";

import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Wallet, Plus, Download } from "lucide-react";
import { getEthersSigner } from "@/lib/eth";
import { HHP_ABI } from "@/lib/abi";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

function ensureHex(addr: string) {
  if (!ethers.isAddress(addr)) throw new Error("Invalid address: " + addr);
  return addr;
}

export default function HhpActions() {
  const { wallets } = useWallets();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    listingId: "",
    startDate: "",
    endDate: "",
    guestAddress: "",
    reservationId: "",
    amount: "",
  });

  const w = wallets[0];

  if (!w) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HHP Contract Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect a wallet to interact with the contract.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function getContract() {
    if (!w) throw new Error("Connect a wallet first.");
    if (w.chainId !== CHAIN_ID) await w.switchChain(CHAIN_ID); // network guard
    const signer = await getEthersSigner(w);
    return new ethers.Contract(CONTRACT_ADDRESS, HHP_ABI, signer);
  }

  // CREATE RESERVATION
  async function handleCreateReservation() {
    if (!formData.listingId || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading("createReservation");
    try {
      const c = await getContract();

      const startTimestamp = Math.floor(
        new Date(formData.startDate).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.endDate).getTime() / 1000
      );
      const nights = Math.ceil((endTimestamp - startTimestamp) / 86400);

      const args = {
        listingId: BigInt(formData.listingId),
        startDate: BigInt(startTimestamp),
        endDate: BigInt(endTimestamp),
        nights: BigInt(nights),
        payers: [w.address],
        bps: [10000], // 100%
      };

      // Fetch proof if required (you'll need to implement this API endpoint)
      const proof = await fetch(
        "/api/eligibility?listingId=" + formData.listingId,
        {
          method: "POST",
        }
      )
        .then((r) => (r.ok ? r.json() : { expiry: 0, nonce: 0, sig: "0x" }))
        .catch(() => ({ expiry: 0, nonce: 0, sig: "0x" }));

      const tx = await c.createReservation(args, {
        expiry: BigInt(proof.expiry || 0),
        nonce: BigInt(proof.nonce || 0),
        sig: proof.sig || "0x",
      });

      toast({
        title: "Transaction Sent",
        description: "Creating reservation... Please wait for confirmation.",
      });

      const rc = await tx.wait();
      console.log("createReservation receipt", rc);

      toast({
        title: "Reservation Created!",
        description: `Reservation ID: ${
          rc.logs[0]?.args?.reservationId || "Unknown"
        }`,
      });

      // Reset form
      setFormData((prev) => ({
        ...prev,
        listingId: "",
        startDate: "",
        endDate: "",
      }));
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create reservation",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  // FUND RESERVATION
  async function handleFundReservation() {
    if (!formData.reservationId || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in reservation ID and amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading("fundReservation");
    try {
      const c = await getContract();
      const listing = await c.listings(1n); // You might want to get the actual listing ID
      const tokenAddr = listing.paymentToken as string;
      const amount = ethers.parseUnits(formData.amount, 6); // Assuming 6 decimals

      // 1) approve
      const signer = await getEthersSigner(w);
      const erc20 = new ethers.Contract(
        tokenAddr,
        ["function approve(address spender,uint256 value) returns (bool)"],
        signer
      );

      toast({
        title: "Approving Token",
        description: "Please approve the token transfer...",
      });

      await (await erc20.approve(CONTRACT_ADDRESS, amount)).wait();

      // 2) fund
      toast({
        title: "Funding Reservation",
        description: "Funding your reservation...",
      });

      const tx = await c.fundReservation(
        BigInt(formData.reservationId),
        amount
      );
      const rc = await tx.wait();
      console.log("fundReservation receipt", rc);

      toast({
        title: "Reservation Funded!",
        description: `Successfully funded ${formData.amount} tokens`,
      });

      // Reset form
      setFormData((prev) => ({ ...prev, reservationId: "", amount: "" }));
    } catch (error) {
      console.error("Error funding reservation:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fund reservation",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  // ADD GUEST
  async function handleAddGuest() {
    if (!formData.reservationId || !formData.guestAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in reservation ID and guest address.",
        variant: "destructive",
      });
      return;
    }

    setLoading("addGuest");
    try {
      const c = await getContract();
      const tx = await c.addGuest(
        BigInt(formData.reservationId),
        ensureHex(formData.guestAddress)
      );

      toast({
        title: "Adding Guest",
        description: "Please wait for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Guest Added!",
        description: `Successfully added ${formData.guestAddress.slice(
          0,
          6
        )}...${formData.guestAddress.slice(-4)}`,
      });

      // Reset form
      setFormData((prev) => ({ ...prev, reservationId: "", guestAddress: "" }));
    } catch (error) {
      console.error("Error adding guest:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add guest",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  // WITHDRAW (builder only)
  async function handleWithdraw() {
    if (!formData.reservationId) {
      toast({
        title: "Missing Information",
        description: "Please fill in reservation ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading("withdraw");
    try {
      const c = await getContract();
      const tx = await c.withdraw(BigInt(formData.reservationId), w.address);

      toast({
        title: "Withdrawing",
        description: "Please wait for confirmation...",
      });

      const rc = await tx.wait();
      console.log("withdraw receipt", rc);

      toast({
        title: "Withdrawal Successful!",
        description: "Funds have been withdrawn to your wallet.",
      });

      // Reset form
      setFormData((prev) => ({ ...prev, reservationId: "" }));
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to withdraw",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          HHP Contract Actions
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Interact with the Hacker House Protocol smart contract
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Reservation */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Create Reservation
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="listingId">Listing ID</Label>
              <Input
                id="listingId"
                type="number"
                placeholder="1"
                value={formData.listingId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    listingId: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            onClick={handleCreateReservation}
            disabled={loading === "createReservation"}
            className="w-full"
          >
            {loading === "createReservation"
              ? "Creating..."
              : "Create Reservation"}
          </Button>
        </div>

        {/* Fund Reservation */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Fund Reservation
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="fundReservationId">Reservation ID</Label>
              <Input
                id="fundReservationId"
                type="number"
                placeholder="1"
                value={formData.reservationId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reservationId: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (tokens)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            onClick={handleFundReservation}
            disabled={loading === "fundReservation"}
            className="w-full"
          >
            {loading === "fundReservation" ? "Funding..." : "Fund Reservation"}
          </Button>
        </div>

        {/* Add Guest */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add Guest
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="guestReservationId">Reservation ID</Label>
              <Input
                id="guestReservationId"
                type="number"
                placeholder="1"
                value={formData.reservationId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reservationId: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="guestAddress">Guest Address</Label>
              <Input
                id="guestAddress"
                placeholder="0x..."
                value={formData.guestAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestAddress: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <Button
            onClick={handleAddGuest}
            disabled={loading === "addGuest"}
            className="w-full"
          >
            {loading === "addGuest" ? "Adding..." : "Add Guest"}
          </Button>
        </div>

        {/* Withdraw */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-4 w-4" />
            Withdraw (Builder Only)
          </h3>
          <div>
            <Label htmlFor="withdrawReservationId">Reservation ID</Label>
            <Input
              id="withdrawReservationId"
              type="number"
              placeholder="1"
              value={formData.reservationId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservationId: e.target.value,
                }))
              }
            />
          </div>
          <Button
            onClick={handleWithdraw}
            disabled={loading === "withdraw"}
            className="w-full"
          >
            {loading === "withdraw" ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>

        {/* Wallet Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Wallet</Badge>
              <span className="font-mono">
                {w.address.slice(0, 6)}...{w.address.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Chain ID</Badge>
              <span>{w.chainId}</span>
              {w.chainId !== CHAIN_ID && (
                <Badge variant="destructive">Wrong Network</Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
