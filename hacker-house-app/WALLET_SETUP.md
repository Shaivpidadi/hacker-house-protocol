# Wallet Setup Guide

This guide explains how to set up the wallet functionality in your Hacker House Protocol app.

## Prerequisites

1. **Privy Account**: Sign up at [console.privy.io](https://console.privy.io/)
2. **Next.js App**: Your app should already be set up with Next.js 15+

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Privy Configuration
# Get these from your Privy dashboard at https://console.privy.io/
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_privy_client_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here

# Optional: Session Signer ID for advanced wallet features
# NEXT_PUBLIC_SESSION_SIGNER_ID=your_session_signer_id_here

# Blockchain Configuration (for NOW token balance fetching)
# Replace with actual NOW token contract addresses
NOW_TOKEN_ETHEREUM=0x0000000000000000000000000000000000000000
NOW_TOKEN_POLYGON=0x0000000000000000000000000000000000000000

# Optional: Blockchain RPC endpoints
# ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
# POLYGON_RPC_URL=https://polygon-rpc.com
```

## Getting Privy Credentials

1. Go to [console.privy.io](https://console.privy.io/)
2. Create a new app or select an existing one
3. Go to the "API Keys" section
4. Copy your App ID, Client ID, and App Secret

## Features Implemented

### 1. Wallet Login (`components/wallet-login.tsx`)

- Simple connect/disconnect wallet button
- Shows wallet address when connected
- Handles authentication state

### 2. Wallet Balance (`components/wallet-balance.tsx`)

- Displays NOW token balances
- Fetches real-time balance data via API
- Refresh button to update balances
- Shows token details (symbol, name, network, address)

### 3. Wallet Manager (`components/wallet-manager.tsx`)

- Comprehensive account management
- Link/unlink wallets, emails, phones, social accounts
- Prevents removing the last account
- Shows connection status for all account types

### 4. Wallet Dashboard (`app/wallet/page.tsx`)

- Combines all wallet components
- Responsive layout
- Information about NOW tokens

### 5. Balance API (`app/api/wallet/balance/route.ts`)

- Secure endpoint for fetching wallet balances
- Authenticates requests using Privy tokens
- Currently returns mock data (ready for real blockchain integration)

## Usage

1. **Connect Wallet**: Users can connect their existing wallet or create a new embedded wallet
2. **View Balances**: See NOW token balances across different networks
3. **Manage Accounts**: Link/unlink various account types (wallet, email, phone, social)
4. **Secure**: All operations are authenticated through Privy

## Customization

### Adding Real Blockchain Integration

To replace the mock balance data with real blockchain calls:

1. **Install blockchain libraries**:

   ```bash
   npm install ethers@6 @alch/alchemy-sdk
   ```

2. **Update the balance API** (`app/api/wallet/balance/route.ts`):

   - Replace mock data with actual contract calls
   - Use ethers.js or Alchemy SDK to query token contracts
   - Handle different networks (Ethereum, Polygon, etc.)

3. **Example for Ethereum**:

   ```typescript
   import { ethers } from "ethers";

   // ERC-20 token contract ABI (minimal)
   const ERC20_ABI = [
     "function balanceOf(address owner) view returns (uint256)",
     "function decimals() view returns (uint8)",
     "function symbol() view returns (string)",
     "function name() view returns (string)",
   ];

   const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
   const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

   const balance = await contract.balanceOf(walletAddress);
   const decimals = await contract.decimals();
   const symbol = await contract.symbol();
   const name = await contract.name();
   ```

### Adding More Token Types

1. **Update the BalanceData interface** to include additional token properties
2. **Modify the balance API** to fetch multiple token types
3. **Add network selection** in the UI for users to choose which network to query

## Security Notes

- All API endpoints verify Privy authentication tokens
- Wallet operations are performed client-side for security
- Server-side operations only handle balance queries
- Never expose private keys or sensitive wallet data

## Troubleshooting

### Common Issues

1. **"Authentication required" error**: Check that your Privy credentials are correct
2. **Wallet not connecting**: Ensure your Privy app is properly configured
3. **Balance not loading**: Check the browser console for API errors

### Debug Mode

Enable debug logging by adding this to your `.env.local`:

```bash
NEXT_PUBLIC_PRIVY_DEBUG=true
```

## Next Steps

1. **Real Blockchain Integration**: Replace mock data with actual contract calls
2. **Transaction Support**: Add send/receive functionality for NOW tokens
3. **Multi-Network Support**: Support for multiple blockchain networks
4. **Advanced Features**: Session signing, batch operations, etc.

## Support

- [Privy Documentation](https://docs.privy.io/)
- [Privy Discord](https://discord.gg/privy)
- [Next.js Documentation](https://nextjs.org/docs)
