"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";

export function useWallet() {
    const {
        ready,
        authenticated,
        user,
        login,
        logout,
        linkWallet,
        unlinkWallet,
        linkEmail,
        unlinkEmail,
        linkPhone,
        unlinkPhone,
        linkGoogle,
        unlinkGoogle,
        linkTwitter,
        unlinkTwitter,
        linkDiscord,
        unlinkDiscord,
    } = usePrivy();

    const walletAddress = useMemo(() => user?.wallet?.address, [user?.wallet?.address]);

    const isConnected = useMemo(() => ready && authenticated, [ready, authenticated]);

    const accountCount = useMemo(() => user?.linkedAccounts?.length || 0, [user?.linkedAccounts?.length]);

    const canRemoveAccount = useMemo(() => accountCount > 1, [accountCount]);

    const connectWallet = useCallback(async () => {
        if (!ready) return;
        try {
            await login();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            throw error;
        }
    }, [login, ready]);

    const disconnectWallet = useCallback(async () => {
        if (!ready) return;
        try {
            await logout();
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
            throw error;
        }
    }, [logout, ready]);

    const linkNewWallet = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkWallet();
        } catch (error) {
            console.error("Failed to link wallet:", error);
            throw error;
        }
    }, [linkWallet, ready, authenticated]);

    const unlinkCurrentWallet = useCallback(async (address: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkWallet(address);
        } catch (error) {
            console.error("Failed to unlink wallet:", error);
            throw error;
        }
    }, [unlinkWallet, ready, authenticated, canRemoveAccount]);

    const linkNewEmail = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkEmail();
        } catch (error) {
            console.error("Failed to link email:", error);
            throw error;
        }
    }, [linkEmail, ready, authenticated]);

    const unlinkCurrentEmail = useCallback(async (email: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkEmail(email);
        } catch (error) {
            console.error("Failed to unlink email:", error);
            throw error;
        }
    }, [unlinkEmail, ready, authenticated, canRemoveAccount]);

    const linkNewPhone = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkPhone();
        } catch (error) {
            console.error("Failed to link phone:", error);
            throw error;
        }
    }, [linkPhone, ready, authenticated]);

    const unlinkCurrentPhone = useCallback(async (phone: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkPhone(phone);
        } catch (error) {
            console.error("Failed to unlink phone:", error);
            throw error;
        }
    }, [unlinkPhone, ready, authenticated, canRemoveAccount]);

    const linkNewGoogle = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkGoogle();
        } catch (error) {
            console.error("Failed to link Google:", error);
            throw error;
        }
    }, [linkGoogle, ready, authenticated]);

    const unlinkCurrentGoogle = useCallback(async (subject: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkGoogle(subject);
        } catch (error) {
            console.error("Failed to unlink Google:", error);
            throw error;
        }
    }, [unlinkGoogle, ready, authenticated, canRemoveAccount]);

    const linkNewTwitter = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkTwitter();
        } catch (error) {
            console.error("Failed to link Twitter:", error);
            throw error;
        }
    }, [linkTwitter, ready, authenticated]);

    const unlinkCurrentTwitter = useCallback(async (subject: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkTwitter(subject);
        } catch (error) {
            console.error("Failed to unlink Twitter:", error);
            throw error;
        }
    }, [unlinkTwitter, ready, authenticated, canRemoveAccount]);

    const linkNewDiscord = useCallback(async () => {
        if (!ready || !authenticated) return;
        try {
            await linkDiscord();
        } catch (error) {
            console.error("Failed to link Discord:", error);
            throw error;
        }
    }, [linkDiscord, ready, authenticated]);

    const unlinkCurrentDiscord = useCallback(async (subject: string) => {
        if (!ready || !authenticated || !canRemoveAccount) return;
        try {
            await unlinkDiscord(subject);
        } catch (error) {
            console.error("Failed to unlink Discord:", error);
            throw error;
        }
    }, [unlinkDiscord, ready, authenticated, canRemoveAccount]);

    return {
        // State
        ready,
        authenticated,
        user,
        walletAddress,
        isConnected,
        accountCount,
        canRemoveAccount,

        // Actions
        connectWallet,
        disconnectWallet,
        linkNewWallet,
        unlinkCurrentWallet,
        linkNewEmail,
        unlinkCurrentEmail,
        linkNewPhone,
        unlinkCurrentPhone,
        linkNewGoogle,
        unlinkCurrentGoogle,
        linkNewTwitter,
        unlinkCurrentTwitter,
        linkNewDiscord,
        unlinkCurrentDiscord,

        // Raw Privy methods (for advanced usage)
        login,
        logout,
        linkWallet,
        unlinkWallet,
        linkEmail,
        unlinkEmail,
        linkPhone,
        unlinkPhone,
        linkGoogle,
        unlinkGoogle,
        linkTwitter,
        unlinkTwitter,
        linkDiscord,
        unlinkDiscord,
    };
}
