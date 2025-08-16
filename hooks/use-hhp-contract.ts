"use client";

import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "./use-wallet";
import { HHP_ABI } from "@/lib/abi";
import { HHP_CONFIG } from "@/lib/constants";
import { getEthersSigner } from "@/lib/eth";
import { useToast } from "./use-toast";
import { Signature } from "ethers";
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

// Solidity-exact types for contract calls
export type CreateReservationArgsSolidity = {
    listingId: bigint;           // uint256
    startDate: bigint;           // uint64 (seconds)
    endDate: bigint;             // uint64 (seconds)
    nights: bigint;              // uint256
    payers: `0x${string}`[];     // address[]
    bps: bigint[];               // uint16[]
};

export type EligibilityProofSolidity = {
    expiry: bigint;              // uint64 (seconds)
    nonce: bigint;               // uint256
    sig: `0x${string}`;          // bytes (0x-prefixed)
};

export interface ReservationData {
    listingId: number;
    renter: string;
    startDate: number;
    endDate: number;
    totalDue: string;
    amountPaid: string;
    active: boolean;
}

// Utility functions
const toSec = (msOrSec: number | bigint) =>
    typeof msOrSec === "bigint" ? msOrSec : BigInt(msOrSec > 2_000_000_000 ? Math.floor(msOrSec / 1000) : msOrSec);

const decodeRevertString = (data: string) => {
    if (!data || data === "0x") return null;
    const selector = data.slice(0, 10);
    if (selector !== "0x08c379a0") return null;
    // strip selector + offset/len; ethers v6 doesn't help, manual decode:
    try {
        // 4 bytes selector + 32 offset + 32 length = 4 + 32 + 32 = 68 bytes = 136 hex chars
        const strHex = "0x" + data.slice(138); // after selector(10) + 64 + 64 = 138
        return ethers.toUtf8String(strHex);
    } catch {
        return null;
    }
};

// TTL validation (contract enforces: block.timestamp <= expiry <= block.timestamp + 600)
function validateTTL(expiry: bigint): void {
    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    if (expiry < nowSec) throw new Error("proof expired");
    if (expiry > nowSec + BigInt(600)) throw new Error("ttl too long");

    console.log("TTL validation:", {
        now: nowSec,
        expiry,
        ttlSeconds: Number(expiry - nowSec),
        isValid: expiry >= nowSec && expiry <= nowSec + BigInt(600)
    });
}

export function useHHPContract() {
    const { walletAddress, connectedWallet, isConnected } = useWallet();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get contract instance
    const getContract = useCallback(async () => {
        if (!isConnected || !walletAddress || !connectedWallet) {
            throw new Error("Wallet not connected");
        }

        try {
            if (!HHP_CONFIG.contractAddress || HHP_CONFIG.contractAddress === '0xYourDeployedHHPContractAddress') {
                throw new Error("HHP contract address not configured. Please set NEXT_PUBLIC_HHP_ADDRESS in your environment variables.");
            }

            console.log("Connected wallet object:", connectedWallet);
            console.log("Wallet type:", typeof connectedWallet);
            console.log("Wallet keys:", Object.keys(connectedWallet || {}));

            const wallet = await getEthersSigner(connectedWallet as any);

            // Check if we're on the correct network
            const network = await wallet.provider.getNetwork();
            console.log("Current network:", network);
            console.log("Expected network ID:", HHP_CONFIG.chainId);

            if (network.chainId !== BigInt(HHP_CONFIG.chainId)) {
                throw new Error(`Wrong network! You're on chain ${network.chainId}, but HHP is deployed on chain ${HHP_CONFIG.chainId}. Please switch to Arbitrum Sepolia.`);
            }

            const contract = new ethers.Contract(
                HHP_CONFIG.contractAddress,
                HHP_ABI,
                wallet
            );
            return contract;
        } catch (err) {
            console.error("Failed to get contract instance:", err);
            if (err instanceof Error) {
                throw new Error(`Failed to connect to contract: ${err.message}`);
            }
            throw new Error("Failed to connect to contract");
        }
    }, [isConnected, walletAddress, connectedWallet]);

    function isLikelyValidSig(sig: string) {
        if (!/^0x[0-9a-fA-F]{130}$/.test(sig)) return false; // 65 bytes
        const r = sig.slice(2, 66), s = sig.slice(66, 130), vHex = sig.slice(130, 132);
        if (/^0+$/.test(r) || /^0+$/.test(s)) return false;
        const v = parseInt(vHex, 16);
        if (![0, 1, 27, 28].includes(v)) return false;
        try { Signature.from(sig); } catch { return false; }
        return true;
    }

    // EIP-712 signature verification
    async function verifyEIP712Signature(
        user: string,
        listingId: number,
        proof: EligibilityProof,
        verifierAddress: string
    ): Promise<boolean> {
        try {
            const domain = {
                name: "HackerHouseProtocol",
                version: "1",
                chainId: HHP_CONFIG.chainId,
                verifyingContract: HHP_CONFIG.contractAddress,
            };

            const types = {
                Eligibility: [
                    { name: "user", type: "address" },
                    { name: "listingId", type: "uint256" },
                    { name: "expiry", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                ],
            };

            const value = {
                user,
                listingId: BigInt(listingId),
                expiry: BigInt(proof.expiry),
                nonce: BigInt(proof.nonce),
            };

            const recovered = ethers.verifyTypedData(domain, types, value, proof.sig);
            const isValid = recovered.toLowerCase() === verifierAddress.toLowerCase();

            console.log("EIP-712 verification:", {
                domain,
                types,
                value,
                recovered,
                verifierAddress,
                isValid
            });

            return isValid;
        } catch (error) {
            console.error("EIP-712 verification failed:", error);
            return false;
        }
    }


    // Create a new reservation
    const createReservation = useCallback(
        async (args: CreateReservationArgs, proof: EligibilityProof) => {
            if (!isConnected || !connectedWallet) {
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

                // Convert to Solidity types with proper validation
                const startDate = toSec(args.startDate);
                const endDate = toSec(args.endDate);

                const createResArgs: CreateReservationArgsSolidity = {
                    listingId: BigInt(args.listingId),
                    startDate, // uint64 (seconds)
                    endDate,   // uint64 (seconds)
                    nights: BigInt(args.nights),
                    payers: args.payers as `0x${string}`[],
                    bps: args.bps.map((x) => BigInt(x)),
                };

                // Preflight client validation (mirrors contract)
                if (createResArgs.nights <= BigInt(0)) throw new Error("nights=0");
                if (createResArgs.endDate <= createResArgs.startDate) throw new Error("bad dates");
                if (createResArgs.payers.length === 0) throw new Error("no payers");
                if (createResArgs.payers.length !== createResArgs.bps.length) throw new Error("payers/bps length mismatch");

                const sumBps = createResArgs.bps.reduce((a, b) => a + b, BigInt(0));
                if (sumBps !== BigInt(10000)) throw new Error("bps must sum to 10000");


                const eligibilityProof: EligibilityProofSolidity = {
                    expiry: toSec(proof.expiry),          // seconds
                    nonce: BigInt(proof.nonce),
                    sig: proof.sig as `0x${string}`,
                };

                // Security validations
                if (!isLikelyValidSig(eligibilityProof.sig)) throw new Error("Invalid sig format");

                // TTL validation (contract enforces: block.timestamp <= expiry <= block.timestamp + 600)
                validateTTL(eligibilityProof.expiry);

                // EIP-712 signature verification
                const verifierAddress = process.env.NEXT_PUBLIC_VERIFIER_ADDRESS;
                if (verifierAddress && verifierAddress !== '0xYourVerifierAddress') {
                    const isSignatureValid = await verifyEIP712Signature(
                        walletAddress!,
                        args.listingId,
                        proof,
                        verifierAddress
                    );

                    if (!isSignatureValid) {
                        throw new Error("EIP-712 signature verification failed");
                    }
                } else {
                    console.warn("Verifier address not configured, skipping signature verification");
                }


                console.log("Create reservation arguments:", createResArgs);
                console.log("Eligibility proof:", eligibilityProof);

                const tx = await contract.createReservation(createResArgs, eligibilityProof);
                const receipt = await tx.wait();

                // Parse event reliably
                const myLogs = receipt.logs.filter(
                    (l: any) => String(l.address).toLowerCase() === String(contract.target).toLowerCase()
                );
                let reservationId: number | null = null;

                for (const log of myLogs) {
                    try {
                        const parsed = contract.interface.parseLog({ topics: log.topics, data: log.data });
                        if (parsed?.name === "ReservationCreated") {
                            // Check your event arg name! Your Solidity emits 'rid'
                            const rid = parsed.args?.rid ?? parsed.args?.reservationId ?? parsed.args?.[0];
                            reservationId = Number(rid);
                            break;
                        }
                    } catch { }
                }

                toast({
                    title: "Reservation created!",
                    description: `Reservation ID: ${reservationId ?? "Unknown"}`,
                });

                return reservationId;
            } catch (err: any) {
                // Enhanced error decoding
                const raw = err?.data ?? err?.error?.data ?? err?.info?.error?.data ?? err?.transaction?.data;
                const decoded = typeof raw === "string" ? decodeRevertString(raw) : null;
                const errCode = typeof raw === "string" ? raw.slice(0, 10) : "";

                const errorMap: Record<string, string> = {
                    "0xf645eedf": "Invalid eligibility proof or signature",
                    "0xfce698f7": "Invalid date format or business logic error",
                    "0x08c379a0": decoded || "Contract Error(string)",
                };

                const friendly = decoded || errorMap[errCode] || err?.reason || err?.shortMessage || err?.message || "Transaction reverted";

                console.error("CreateReservation error", { msg: friendly, err, raw });
                setError(friendly);
                toast({ title: "Error", description: friendly, variant: "destructive" });
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [isConnected, getContract, toast, connectedWallet]
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
