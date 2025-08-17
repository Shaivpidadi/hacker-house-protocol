"use client";

import { useWallets } from "@privy-io/react-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Wallet,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useUserReservations } from "@/hooks/use-hhp-data";
import { formatEther } from "ethers";
import Link from "next/link";

export default function HhpUserReservations() {
  const { wallets } = useWallets();
  const w = wallets[0];

  const { data, isLoading, error, refetch } = useUserReservations(
    w?.address || ""
  );

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-destructive mb-4">Error loading reservations</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const reservations = data?.reservationCreateds || [];

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isReservationActive = (endDate: number) => {
    return new Date(endDate * 1000) > new Date();
  };

  const getReservationStatus = (reservation: any) => {
    const isActive = isReservationActive(reservation.endDate);
    const isPast = new Date(reservation.startDate * 1000) < new Date();

    if (isPast && !isActive) return "completed";
    if (isActive) return "active";
    return "upcoming";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Reservations
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Your HHP protocol reservations
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reservations found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by creating a reservation from available listings
            </p>
            <Button asChild className="mt-4">
              <Link href="/hhp">Browse Listings</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const status = getReservationStatus(reservation);

              return (
                <Card
                  key={reservation.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            Reservation #{reservation.id}
                          </h3>
                          {getStatusBadge(status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4" />
                            Listing ID: {reservation.listingId}
                          </div>
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Renter: {formatAddress(reservation.renter)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">Created</div>
                        <div>{formatTimestamp(reservation.blockTimestamp)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>
                        <div className="font-medium">
                          {formatTimestamp(reservation.startDate)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date:</span>
                        <div className="font-medium">
                          {formatTimestamp(reservation.endDate)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nights:</span>
                        <div className="font-medium">{reservation.nights}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payers:</span>
                        <div className="font-medium flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {reservation.payers.length}
                        </div>
                      </div>
                    </div>

                    {/* Payment Distribution */}
                    {reservation.payers.length > 0 && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">
                          Payment Distribution:
                        </div>
                        <div className="space-y-1">
                          {reservation.payers.map((payer, index) => (
                            <div
                              key={payer}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-muted-foreground">
                                {formatAddress(payer)}
                                {payer === reservation.renter && " (You)"}
                              </span>
                              <span className="font-medium">
                                {reservation.bps[index] / 100}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Link href={`/hhp?reservationId=${reservation.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {status === "upcoming" && (
                        <Button asChild size="sm" className="flex-1">
                          <Link
                            href={`/hhp?reservationId=${reservation.id}&action=fund`}
                          >
                            <Wallet className="h-4 w-4 mr-2" />
                            Fund
                          </Link>
                        </Button>
                      )}
                      {status === "active" && (
                        <Button
                          asChild
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                        >
                          <Link
                            href={`/hhp?reservationId=${reservation.id}&action=addGuest`}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Add Guest
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {reservations.length > 0 && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Total Reservations:{" "}
              <span className="font-medium text-foreground">
                {reservations.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Active:{" "}
              <span className="font-medium text-foreground">
                {
                  reservations.filter(
                    (r) => getReservationStatus(r) === "active"
                  ).length
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
