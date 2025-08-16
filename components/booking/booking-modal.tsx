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
  const { isConnected, connectWallet } = useWallet();
  const { createReservation, fundReservation, isLoading, error } =
    useHHPContract();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestAddress, setNewGuestAddress] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [paymentSplits, setPaymentSplits] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationId, setReservationId] = useState<number | null>(null);

  // Calculate total cost
  const totalCost = nights * parseFloat(nightlyRate);
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
    const mockProof: EligibilityProof = {
      expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      nonce: Math.floor(Math.random() * 1000000),
      sig: "0x" + "0".repeat(130), // Mock signature
    };

    const args: CreateReservationArgs = {
      listingId: parseInt(listingId),
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      nights,
      payers: [guests.map((g) => g.address)], // For now, just the booker
      bps: [10000], // 100% for the booker
    };

    try {
      const id = await createReservation(args, mockProof);
      if (id) {
        setReservationId(id);
        setCurrentStep(3);
      }
    } catch (err) {
      console.error("Failed to create reservation:", err);
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
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Select Dates</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-sm">Check-in</Label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label className="text-sm">Check-out</Label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => !startDate || date <= startDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>

            {startDate && endDate && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>{nights}</strong> night{nights > 1 ? "s" : ""} •
                  <strong> ${totalCost.toFixed(2)}</strong> total
                </p>
                <p className="text-xs text-gray-600">
                  ${parseFloat(nightlyRate).toFixed(2)} per night
                </p>
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
              <Label>Add Guests (Optional)</Label>
              <p className="text-sm text-gray-600 mb-3">
                Maximum {maxGuests} guests allowed
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
                <div className="space-y-2 mt-3">
                  <Input
                    placeholder="Guest wallet address"
                    value={newGuestAddress}
                    onChange={(e) => setNewGuestAddress(e.target.value)}
                  />
                  <Input
                    placeholder="Guest name"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                  />
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
              )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Payment Summary</p>
              <div className="text-xs space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>Total cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Per person:</span>
                  <span>${costPerPerson.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests.length + 1}</span>
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
