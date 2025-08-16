import { ethers } from 'ethers';
import type { ConnectedWallet } from '@privy-io/react-auth';

export async function getEthersSigner(wallet: ConnectedWallet) {
    // Privy gives an EIP-1193 provider. Wrap it with ethers v6 BrowserProvider.
    const eip1193 = await wallet.getEthereumProvider(); // Privy
    const provider = new ethers.BrowserProvider(eip1193); // ethers v6
    return await provider.getSigner();
}
