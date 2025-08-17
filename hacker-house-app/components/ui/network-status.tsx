"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { HHP_CONFIG } from "@/lib/constants";

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className }: NetworkStatusProps) {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setCurrentChainId(parseInt(chainId, 16));
        } catch (error) {
          console.error("Failed to get chain ID:", error);
        }
      }
    };

    checkNetwork();

    // Listen for network changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", (chainId: string) => {
        setCurrentChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  const switchToArbitrumSepolia = async () => {
    if (typeof window === "undefined" || !window.ethereum) return;

    setIsLoading(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x66eee" }], // 421614 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x66eee",
                chainName: "Arbitrum Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
                blockExplorerUrls: ["https://sepolia.arbiscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Arbitrum Sepolia:", addError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentChainId === null) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking network...</span>
      </div>
    );
  }

  const isCorrectNetwork = currentChainId === HHP_CONFIG.chainId;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isCorrectNetwork ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Arbitrum Sepolia
          </Badge>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Wrong Network
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={switchToArbitrumSepolia}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : null}
            Switch to Arbitrum Sepolia
          </Button>
        </>
      )}
    </div>
  );
}
