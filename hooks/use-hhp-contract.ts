"use client";

import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./use-wallet";
import { HHP_ABI } from "@/lib/abi";
import { HHP_CONFIG } from "@/lib/constants";
import { getEthersSigner } from "@/lib/eth";
import { useToast } from "./use-toast";

export interface CreateReservationArgs {
    listingId: number;
    startDate: number; // Unix timestamp
    endDate: number; // Unix timestamp
    nights: number;
    payers: string[]; // Array of wallet addresses
    bps: number[]; // Array of basis points for payment splits
}

export interface EligibilityProof {
    expiry: number; // Unix timestamp
    nonce: number;
    sig: string; // Hex signature
}

export interface ReservationData {
    listingId: number;
    renter: string;
    startDate: number;
    endDate: number;
    totalDue: string;
    amountPaid: string;
    active: boolean;
}

export function useHHPContract() {
    const { walletAddress, isConnected } = useWallet();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get contract instance
    const getContract = useCallback(async () => {
        if (!isConnected || !walletAddress) {
            throw new Error("Wallet not connected");
        }

        try {
            const wallet = await getEthersSigner();
            const contract = new ethers.Contract(
                HHP_CONFIG.contractAddress,
                HHP_ABI,
                wallet
            );
            return contract;
        } catch (err) {
            console.error("Failed to get contract instance:", err);
            throw new Error("Failed to connect to contract");
        }
    }, [isConnected, walletAddress]);

    // Create a new reservation
    const createReservation = useCallback(
        async (args: CreateReservationArgs, proof: EligibilityProof) => {
            if (!isConnected) {
                toast({
                    title: "Wallet not connected",
                    description: "Please connect your wallet to create a reservation",
                    variant: "destructive",
                });
                return null;
            }

            setIsLoading(true);
            setError(null);

            try {
                const contract = await getContract();

                // Convert dates to uint64
                const startDateUint64 = BigInt(Math.floor(args.startDate / 1000));
                const endDateUint64 = BigInt(Math.floor(args.endDate / 1000));

                const createResArgs = {
                    listingId: BigInt(args.listingId),
                    startDate: startDateUint64,
                    endDate: endDateUint64,
                    nights: BigInt(args.nights),
                    payers: args.payers,
                    bps: args.bps.map(bp => BigInt(bp)),
                };

                const eligibilityProof = {
                    expiry: BigInt(proof.expiry),
                    nonce: BigInt(proof.nonce),
                    sig: proof.sig,
                };

                const tx = await contract.createReservation(createResArgs, eligibilityProof);
                const receipt = await tx.wait();

                // Find the ReservationCreated event
                const event = receipt.logs.find((log: any) => {
                    try {
                        const parsed = contract.interface.parseLog(log);
                        return parsed?.name === "ReservationCreated";
                    } catch {
                        return false;
                    }
                });

                let reservationId: number | null = null;
                if (event) {
                    const parsed = contract.interface.parseLog(event);
                    reservationId = Number(parsed.args.reservationId);
                }

                toast({
                    title: "Reservation created!",
                    description: `Reservation ID: ${reservationId || "Unknown"}`,
                });

                return reservationId;
            } catch (err: any) {
                const errorMessage = err.reason || err.message || "Failed to create reservation";
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [isConnected, getContract, toast]
    );

    // Fund a reservation
    const fundReservation = useCallback(
        async (reservationId: number, amount: string) => {
            if (!isConnected) {
                toast({
                    title: "Wallet not connected",
                    description: "Please connect your wallet to fund a reservation",
                    variant: "destructive",
                });
                return false;
            }

            setIsLoading(true);
            setError(null);

            try {
                const contract = await getContract();

                // Convert amount to wei (assuming ETH payment)
                const amountWei = ethers.parseEther(amount);

                const tx = await contract.fundReservation(
                    BigInt(reservationId),
                    amountWei,
                    { value: amountWei } // Send ETH with the transaction
                );

                await tx.wait();

                toast({
                    title: "Reservation funded!",
                    description: `Successfully funded reservation ${reservationId}`,
                });

                return true;
            } catch (err: any) {
                const errorMessage = err.reason || err.message || "Failed to fund reservation";
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [isConnected, getContract, toast]
    );

    // Add a guest to a reservation
    const addGuest = useCallback(
        async (reservationId: number, guestAddress: string) => {
            if (!isConnected) {
                toast({
                    title: "Wallet not connected",
                    description: "Please connect your wallet to add a guest",
                    variant: "destructive",
                });
                return false;
            }

            setIsLoading(true);
            setError(null);

            try {
                const contract = await getContract();

                const tx = await contract.addGuest(BigInt(reservationId), guestAddress);
                await tx.wait();

                toast({
                    title: "Guest added!",
                    description: `Successfully added ${guestAddress} to reservation ${reservationId}`,
                });

                return true;
            } catch (err: any) {
                const errorMessage = err.reason || err.message || "Failed to add guest";
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [isConnected, getContract, toast]
    );

    // Get reservation data
    const getReservation = useCallback(
        async (reservationId: number): Promise<ReservationData | null> => {
            try {
                const contract = await getContract();
                const reservation = await contract.reservations(BigInt(reservationId));

                return {
                    listingId: Number(reservation.listingId),
                    renter: reservation.renter,
                    startDate: Number(reservation.startDate),
                    endDate: Number(reservation.endDate),
                    totalDue: reservation.totalDue.toString(),
                    amountPaid: reservation.amountPaid.toString(),
                    active: reservation.active,
                };
            } catch (err) {
                console.error("Failed to get reservation:", err);
                return null;
            }
        },
        [getContract]
    );

    // Get reservation guests
    const getReservationGuests = useCallback(
        async (reservationId: number): Promise<string[]> => {
            try {
                const contract = await getContract();
                return await contract.getReservationGuests(BigInt(reservationId));
            } catch (err) {
                console.error("Failed to get reservation guests:", err);
                return [];
            }
        },
        [getContract]
    );

    // Get reservation payers
    const getReservationPayers = useCallback(
        async (reservationId: number): Promise<string[]> => {
            try {
                const contract = await getContract();
                return await contract.getReservationPayers(BigInt(reservationId));
            } catch (err) {
                console.error("Failed to get reservation payers:", err);
                return [];
            }
        },
        [getContract]
    );

    // Get reservation payment splits
    const getReservationSplits = useCallback(
        async (reservationId: number): Promise<number[]> => {
            try {
                const contract = await getContract();
                const bps = await contract.getReservationSplitsBps(BigInt(reservationId));
                return bps.map((bp: any) => Number(bp));
            } catch (err) {
                console.error("Failed to get reservation splits:", err);
                return [];
            }
        },
        [getContract]
    );

    return {
        // State
        isLoading,
        error,

        // Actions
        createReservation,
        fundReservation,
        addGuest,

        // View functions
        getReservation,
        getReservationGuests,
        getReservationPayers,
        getReservationSplits,

        // Utility
        isConnected,
        walletAddress,
    };
}
