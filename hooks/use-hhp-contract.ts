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

                // Check if we're in development mode (no verifier address configured)
                const verifierAddress = process.env.NEXT_PUBLIC_VERIFIER_ADDRESS;
                const forceDevMode = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_FORCE_DEV_MODE === 'true';
                const isDevelopmentMode = forceDevMode || !verifierAddress || verifierAddress === '0xYourVerifierAddress';

                console.log("Environment check:", {
                    verifierAddress,
                    isDevelopmentMode,
                    forceDevMode,
                    nodeEnv: process.env.NODE_ENV,
                    envVar: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS,
                    isPlaceholder: verifierAddress === '0xYourVerifierAddress',
                    isUndefined: !verifierAddress
                });

                if (isDevelopmentMode) {
                    console.log("Development mode: Skipping signature validation");
                    // In development mode, we can use a placeholder signature
                    // but we still need to ensure it has the right format for the contract
                    if (!eligibilityProof.sig.startsWith('0x') || eligibilityProof.sig.length !== 132) {
                        // Create a valid format placeholder signature for development
                        eligibilityProof.sig = '0x' + '1'.repeat(64) + '2'.repeat(64) + '1b' as `0x${string}`;
                    }
                } else {
                    console.log("Production mode: Enforcing strict signature validation");
                    // Production mode: strict signature validation
                    if (!isLikelyValidSig(eligibilityProof.sig)) {
                        throw new Error("Invalid sig format");
                    }
                }

                // TTL validation (contract enforces: block.timestamp <= expiry <= block.timestamp + 600)
                validateTTL(eligibilityProof.expiry);

                // EIP-712 signature verification (only in production mode)
                if (!isDevelopmentMode && verifierAddress) {
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
                    console.warn("Development mode: Skipping EIP-712 signature verification");
                }

                console.log("Create reservation arguments:", createResArgs);
                console.log("Eligibility proof:", eligibilityProof);
                console.log("Mode:", isDevelopmentMode ? "Development" : "Production");

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

    // Helper function to check if reservation was activated from transaction receipt
    const checkActivationFromReceipt = async (contract: any, receipt: any): Promise<boolean> => {
        try {
            // Parse ReservationFunded events from the receipt
            for (const log of receipt.logs) {
                if (log.address.toLowerCase() !== contract.target.toLowerCase()) continue;
                try {
                    const parsed = contract.interface.parseLog({ topics: log.topics, data: log.data });
                    if (parsed?.name === "ReservationFunded") {
                        const activated = parsed.args.activated;
                        console.log("ReservationFunded event:", {
                            reservationId: parsed.args.reservationId?.toString(),
                            payer: parsed.args.payer,
                            amount: parsed.args.amount?.toString(),
                            newTotalPaid: parsed.args.newTotalPaid?.toString(),
                            activated: activated
                        });
                        return Boolean(activated);
                    }
                } catch (parseError) {
                    console.log("Could not parse log:", parseError);
                }
            }
            return false;
        } catch (error) {
            console.error("Error checking activation from receipt:", error);
            return false;
        }
    };

    // Get reservation details
    const getReservationDetails = useCallback(
        async (reservationId: number) => {
            if (!isConnected) {
                throw new Error("Wallet not connected");
            }

            try {
                const contract = await getContract();
                const reservation = await contract.reservations(BigInt(reservationId));
                const listing = await contract.listings(BigInt(Number(reservation.listingId)));

                return {
                    reservation: {
                        listingId: Number(reservation.listingId),
                        renter: reservation.renter,
                        startDate: Number(reservation.startDate),
                        endDate: Number(reservation.endDate),
                        totalDue: reservation.totalDue.toString(),
                        amountPaid: reservation.amountPaid.toString(),
                        active: reservation.active
                    },
                    listing: {
                        builder: listing.builder,
                        paymentToken: listing.paymentToken,
                        nightlyRate: listing.nightlyRate.toString(),
                        maxGuests: Number(listing.maxGuests),
                        active: listing.active
                    }
                };
            } catch (error) {
                console.error("Error getting reservation details:", error);
                throw new Error("Failed to get reservation details");
            }
        },
        [isConnected, getContract]
    );

    // Fund a reservation
    const fundReservation = useCallback(
        async (reservationId: number, amount: string) => {
            if (!isConnected || !connectedWallet) {
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
                // Get reservation and listing details
                const details = await getReservationDetails(reservationId);
                const { reservation, listing } = details;

                // Validate that the reservation exists and can be funded
                // Note: reservations start as inactive (active=false) and become active when fully funded
                if (reservation.active) {
                    throw new Error("Reservation is already active (fully funded)");
                }

                // Calculate remaining amount to pay (in token base units)
                const totalDue = BigInt(reservation.totalDue);
                const amountPaid = BigInt(reservation.amountPaid);
                const remainingAmount = totalDue - amountPaid;

                if (remainingAmount <= BigInt(0)) {
                    throw new Error("Reservation is already fully funded");
                }

                // Use the remaining amount instead of user input to avoid overshoot
                const fundingAmount = remainingAmount;

                console.log("Funding calculation:", {
                    totalDue: ethers.formatEther(totalDue),
                    amountPaid: ethers.formatEther(amountPaid),
                    remainingAmount: ethers.formatEther(remainingAmount),
                    willFundExactly: ethers.formatEther(fundingAmount)
                });

                console.log("Funding reservation:", {
                    reservationId,
                    amount,
                    listingId: reservation.listingId,
                    paymentTokenAddress: listing.paymentToken,
                    totalDue: reservation.totalDue,
                    amountPaid: reservation.amountPaid,
                    remainingAmount: ethers.formatEther(remainingAmount),
                    fundingAmount: ethers.formatEther(fundingAmount)
                });

                // Check if it's ETH (address(0)) or an ERC-20 token
                const isETH = listing.paymentToken === '0x0000000000000000000000000000000000000000';

                const contract = await getContract();
                let activated = false;

                if (isETH) {
                    // Handle ETH payment
                    toast({
                        title: "Funding Reservation",
                        description: "Funding your reservation with ETH...",
                    });

                    const tx = await contract.fundReservation(
                        BigInt(reservationId),
                        fundingAmount,
                        { value: fundingAmount } // Send ETH with the transaction
                    );

                    const receipt = await tx.wait();
                    activated = await checkActivationFromReceipt(contract, receipt);
                } else {
                    // Handle ERC-20 token payment
                    const wallet = await getEthersSigner(connectedWallet as any);

                    // Create ERC-20 contract instance for approval
                    const erc20Abi = [
                        "function approve(address spender, uint256 value) returns (bool)",
                        "function allowance(address owner, address spender) view returns (uint256)",
                        "function balanceOf(address owner) view returns (uint256)"
                    ];

                    const erc20Contract = new ethers.Contract(listing.paymentToken, erc20Abi, wallet);

                    // Check current allowance
                    const currentAllowance = await erc20Contract.allowance(walletAddress, contract.target);

                    if (currentAllowance < fundingAmount) {
                        toast({
                            title: "Approving Token",
                            description: "Please approve the token transfer...",
                        });

                        // Approve the contract to spend tokens
                        const approveTx = await erc20Contract.approve(contract.target, fundingAmount);
                        await approveTx.wait();

                        toast({
                            title: "Token Approved",
                            description: "Token approved successfully!",
                        });
                    }

                    // Now fund the reservation
                    toast({
                        title: "Funding Reservation",
                        description: "Funding your reservation...",
                    });

                    const tx = await contract.fundReservation(
                        BigInt(reservationId),
                        fundingAmount
                    );

                    const receipt = await tx.wait();
                    activated = await checkActivationFromReceipt(contract, receipt);
                }

                toast({
                    title: activated ? "Reservation Activated!" : "Reservation Funded!",
                    description: activated
                        ? `Reservation ${reservationId} is now active and ready for check-in!`
                        : `Successfully funded reservation ${reservationId}. More funding may be needed to activate.`,
                });

                return { success: true, activated };
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

                const friendly = decoded || errorMap[errCode] || err?.reason || err?.shortMessage || err?.message || "Failed to fund reservation";

                console.error("FundReservation error", { msg: friendly, err, raw });
                setError(friendly);
                toast({
                    title: "Error",
                    description: friendly,
                    variant: "destructive",
                });
                return { success: false, activated: false };
            } finally {
                setIsLoading(false);
            }
        },
        [isConnected, connectedWallet, getContract, walletAddress, toast, getReservationDetails]
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
        getReservationDetails,
        getReservationGuests,
        getReservationPayers,
        getReservationSplits,

        // Utility
        isConnected,
        walletAddress,
    };
}
