"use client";

import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getEthersSigner } from "@/lib/eth";
import { HHP_ABI } from "@/lib/abi";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  listingId: string;
  renter: string;
  startDate: string;
  endDate: string;
  totalDue: string;
  amountPaid: string;
  active: boolean;
}

export default function ReservationManager() {
  const { wallets } = useWallets();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(
    null
  );

  const w = wallets[0];

  useEffect(() => {
    if (w) {
      fetchReservations();
    }
  }, [w]);

  async function fetchReservations() {
    if (!w) return;

    setLoading(true);
    try {
      const signer = await getEthersSigner(w);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, HHP_ABI, signer);

      // This is a simplified example - you'd need to implement proper reservation tracking
      // For now, we'll show a placeholder
      setReservations([
        {
          id: "1",
          listingId: "1",
          renter: w.address,
          startDate: new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0], // tomorrow
          endDate: new Date(Date.now() + 86400000 * 4)
            .toISOString()
            .split("T")[0], // +3 days
          totalDue: "450.00",
          amountPaid: "0.00",
          active: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!w) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect a wallet to view your reservations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Reservations
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Manage your HHP protocol reservations
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reservations found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first reservation to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`p-4 border rounded-lg transition-all ${
                  selectedReservation === reservation.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() =>
                  setSelectedReservation(
                    selectedReservation === reservation.id
                      ? null
                      : reservation.id
                  )
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={reservation.active ? "default" : "secondary"}
                    >
                      {reservation.active ? "Active" : "Completed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ID: {reservation.id}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReservation(
                        selectedReservation === reservation.id
                          ? null
                          : reservation.id
                      );
                    }}
                  >
                    {selectedReservation === reservation.id
                      ? "Hide"
                      : "Details"}
                  </Button>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {reservation.startDate} → {reservation.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {reservation.amountPaid} / {reservation.totalDue} paid
                    </span>
                  </div>
                </div>

                {selectedReservation === reservation.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Listing ID:
                        </span>
                        <span className="ml-2 font-mono">
                          {reservation.listingId}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Renter:</span>
                        <span className="ml-2 font-mono">
                          {reservation.renter.slice(0, 6)}...
                          {reservation.renter.slice(-4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={reservation.active ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {reservation.active ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {reservation.active ? "Active" : "Completed"}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment:</span>
                        <span className="ml-2">
                          {reservation.amountPaid} / {reservation.totalDue}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {reservation.active && (
                        <>
                          <Button size="sm" variant="outline">
                            <Wallet className="h-4 w-4 mr-2" />
                            Fund
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4 mr-2" />
                            Add Guest
                          </Button>
                        </>
                      )}
                      {!reservation.active &&
                        reservation.amountPaid === reservation.totalDue && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Withdraw
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={fetchReservations}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? "Refreshing..." : "Refresh Reservations"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
