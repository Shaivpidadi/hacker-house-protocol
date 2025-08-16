import { ethers } from 'ethers';
import type { ConnectedWallet } from '@privy-io/react-auth';

export async function getEthersSigner(wallet: ConnectedWallet) {
    try {
        console.log('Getting ethers signer for wallet:', wallet);

        // For Privy wallets, the wallet object contains metadata, not the provider itself
        // Since this is a MetaMask wallet (based on the error), use window.ethereum directly
        if (typeof window !== 'undefined' && window.ethereum) {
            console.log('Using window.ethereum for wallet connection');
            const provider = new ethers.BrowserProvider(window.ethereum);
            return await provider.getSigner();
        }

        throw new Error('No Ethereum provider available (window.ethereum not found)');
    } catch (error) {
        console.error('Error getting ethers signer:', error);
        console.log('Wallet object:', wallet);
        throw new Error(`Failed to get ethers signer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
