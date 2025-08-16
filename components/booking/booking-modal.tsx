"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, Calendar as CalendarIcon } from "lucide-react";
import {
  useHHPContract,
  CreateReservationArgs,
  EligibilityProof,
} from "@/hooks/use-hhp-contract";
import { useWallet } from "@/hooks/use-wallet";
import { formatAddress } from "@/lib/utils";
import { formatUnits } from "ethers";
import { NetworkStatus } from "@/components/ui/network-status";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  nightlyRate: string;
  maxGuests: number;
  requireProof: boolean;
}

interface Guest {
  address: string;
  name: string;
}

export function BookingModal({
  isOpen,
  onClose,
  listingId,
  nightlyRate,
  maxGuests,
  requireProof,
}: BookingModalProps) {
  const { isConnected, connectWallet, walletAddress } = useWallet();
  const { createReservation, fundReservation, isLoading, error } =
    useHHPContract();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestAddress, setNewGuestAddress] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [paymentSplits, setPaymentSplits] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationId, setReservationId] = useState<number | null>(null);

  // Calculate total cost (6 decimal places)
  const totalCost = nights * parseFloat(formatUnits(nightlyRate || "0", 6));
  const costPerPerson = totalCost / Math.max(guests.length + 1, 1);

  // Calculate nights when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
    }
  }, [startDate, endDate]);

  // Calculate payment splits when guests change
  useEffect(() => {
    const totalPeople = guests.length + 1; // +1 for the booker
    const split = Math.floor(10000 / totalPeople); // Basis points (10000 = 100%)
    const splits = Array(totalPeople).fill(split);

    // Adjust the last split to account for rounding
    const remainder = 10000 - split * totalPeople;
    if (remainder > 0) {
      splits[splits.length - 1] += remainder;
    }

    setPaymentSplits(splits);
  }, [guests]);

  const handleAddGuest = () => {
    if (newGuestAddress && newGuestName && guests.length < maxGuests - 1) {
      setGuests([...guests, { address: newGuestAddress, name: newGuestName }]);
      setNewGuestAddress("");
      setNewGuestName("");
    }
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleCreateReservation = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    // For now, we'll create a mock eligibility proof
    // In production, this should come from your backend/verifier
    // Note: This mock signature will fail EIP-712 verification
    const mockProof: EligibilityProof = {
      expiry: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now (within 600s TTL limit)
      nonce: Math.floor(Math.random() * 1000000),
      sig: "0x" + "0".repeat(132), // Mock signature (65 bytes = 130 hex chars + 0x prefix)
    };

    if (!walletAddress) {
      throw new Error("Wallet address not available");
    }

    // Validate dates are not too far in the future
    const now = Date.now();
    const maxFutureDate = now + 30 * 24 * 60 * 60 * 1000; // 30 days from now

    if (
      startDate.getTime() > maxFutureDate ||
      endDate.getTime() > maxFutureDate
    ) {
      toast({
        title: "Invalid dates",
        description: "Please select dates within the next 30 days",
        variant: "destructive",
      });
      return;
    }

    // Validate end date is after start date
    if (endDate.getTime() <= startDate.getTime()) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    const args: CreateReservationArgs = {
      listingId: parseInt(listingId),
      startDate: startDate.getTime(), // Keep as milliseconds, will be converted in hook
      endDate: endDate.getTime(), // Keep as milliseconds, will be converted in hook
      nights,
      payers: [walletAddress, ...guests.map((g) => g.address)], // Bookers + guests
      bps: [
        10000 - guests.length * Math.floor(10000 / (guests.length + 1)),
        ...guests.map(() => Math.floor(10000 / (guests.length + 1))),
      ], // Split evenly
    };

    console.log("About to create reservation with TTL:", {
      expiry: mockProof.expiry,
      expiryTime: new Date(mockProof.expiry * 1000).toISOString(),
      currentTime: new Date().toISOString(),
      ttlSeconds: mockProof.expiry - Math.floor(Date.now() / 1000),
    });

    console.log("Reservation arguments:", {
      listingId: args.listingId,
      startDate: new Date(args.startDate).toISOString(),
      endDate: new Date(args.endDate).toISOString(),
      nights: args.nights,
      payers: args.payers,
      bps: args.bps,
    });

    try {
      const id = await createReservation(args, mockProof);
      if (id) {
        setReservationId(id);
        setCurrentStep(3);
      }
    } catch (err) {
      console.error("Failed to create reservation:", err);
      // Show user-friendly error
      toast({
        title: "Reservation Failed",
        description:
          "The smart contract rejected the transaction. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleFundReservation = async () => {
    if (!reservationId) return;

    try {
      const success = await fundReservation(
        reservationId,
        totalCost.toString()
      );
      if (success) {
        setCurrentStep(4);
      }
    } catch (err) {
      console.error("Failed to fund reservation:", err);
    }
  };

  const resetModal = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setNights(1);
    setGuests([]);
    setNewGuestAddress("");
    setNewGuestName("");
    setPaymentSplits([]);
    setCurrentStep(1);
    setReservationId(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Property</DialogTitle>
          <NetworkStatus className="mt-2" />
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Select Dates</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          startDate.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                        disabled={!startDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          endDate.toLocaleDateString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => !startDate || date <= startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Quick Date Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "1 night", days: 1 },
                    { label: "2 nights", days: 2 },
                    { label: "3 nights", days: 3 },
                    { label: "1 week", days: 7 },
                  ].map((option) => (
                    <Button
                      key={option.days}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (startDate) {
                          const newEndDate = new Date(startDate);
                          newEndDate.setDate(startDate.getDate() + option.days);
                          setEndDate(newEndDate);
                        }
                      }}
                      disabled={!startDate}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {startDate && endDate && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">
                    Booking Summary
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {nights} night{nights > 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Rate per night:</span>
                    <span className="font-medium">
                      ${parseFloat(nightlyRate).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total cost:</span>
                    <span className="font-bold text-lg text-blue-900">
                      ${totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!startDate || !endDate}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">
                  Add Guests (Optional)
                </Label>
                <Badge variant="outline" className="text-xs">
                  {guests.length + 1}/{maxGuests} guests
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Invite other users to join your reservation. They can contribute
                to the payment.
              </p>

              <div className="space-y-2">
                {guests.map((guest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <User className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{guest.name}</p>
                      <p className="text-xs text-gray-600 font-mono">
                        {formatAddress(guest.address)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGuest(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {guests.length < maxGuests - 1 && (
                <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center mb-3">
                    <User className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Add New Guest
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Wallet Address
                      </Label>
                      <Input
                        placeholder="0x1234...5678"
                        value={newGuestAddress}
                        onChange={(e) => setNewGuestAddress(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Display Name
                      </Label>
                      <Input
                        placeholder="Guest's name"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleAddGuest}
                      disabled={!newGuestAddress || !newGuestName}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Guest
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-green-900">
                  Payment Summary
                </p>
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  {guests.length + 1}{" "}
                  {guests.length === 0 ? "person" : "people"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total cost:</span>
                  <span className="font-medium">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Per person:</span>
                  <span className="font-medium text-green-700">
                    ${costPerPerson.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Your share:</span>
                    <span className="text-green-900">
                      ${costPerPerson.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleCreateReservation}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Reservation"}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 text-center">
            <div className="text-green-600">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Reservation Created!</h3>
              <p className="text-sm text-gray-600">
                Reservation ID: {reservationId}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <strong>Next step:</strong> Fund your reservation with $
                {totalCost.toFixed(2)}
              </p>
            </div>

            <Button
              onClick={handleFundReservation}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Funding..." : "Fund Reservation"}
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 text-center">
            <div className="text-green-600">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Reservation Funded!</h3>
              <p className="text-sm text-gray-600">
                Your reservation is now active
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                <strong>Reservation ID:</strong> {reservationId}
              </p>
              <p className="text-sm">
                <strong>Amount paid:</strong> ${totalCost.toFixed(2)}
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
