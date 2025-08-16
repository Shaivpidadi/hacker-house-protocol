export const CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_HHP_ADDRESS || '0xYourDeployedAddress';
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 421614); // Arbitrum Sepolia by default

// Arbitrum Sepolia configuration
export const ARBITRUM_SEPOLIA = {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: 'https://sepolia.arbiscan.io',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
};

// HHP Protocol configuration
// To enable development mode (skip signature validation), set NEXT_PUBLIC_VERIFIER_ADDRESS to '0xYourVerifierAddress'
// To enable production mode (strict signature validation), set NEXT_PUBLIC_VERIFIER_ADDRESS to your actual verifier address
export const HHP_CONFIG = {
    contractAddress: CONTRACT_ADDRESS,
    chainId: CHAIN_ID,
    treasuryAddress: process.env.NEXT_PUBLIC_TREASURY_ADDRESS || '0xYourTreasuryAddress',
    verifierAddress: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS || '0xYourVerifierAddress',
};
