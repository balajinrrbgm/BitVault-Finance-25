// RPC Configuration for Starknet v0.9.0 compatibility
export const RPC_ENDPOINTS = {
  sepolia: [
    // Primary endpoints (v0.9.0 compatible)
    'https://starknet-sepolia.public.blastapi.io/rpc/v0_9',
    'https://free-rpc.nethermind.io/sepolia-juno/v0_9',
    'https://rpc.nethermind.io/sepolia-juno/v0_9',
    
    // Alchemy (requires API key)
    // 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_9/YOUR_ALCHEMY_KEY',
    
    // Infura (requires API key)
    // 'https://starknet-sepolia.infura.io/v3/YOUR_INFURA_KEY',
  ],
  mainnet: [
    'https://starknet-mainnet.public.blastapi.io/rpc/v0_9',
    'https://free-rpc.nethermind.io/mainnet-juno/v0_9',
    'https://rpc.nethermind.io/mainnet-juno/v0_9',
  ]
};

// Version compatibility check
export const SUPPORTED_VERSIONS = ['0.9.0', '0.9.1'];
export const CURRENT_VERSION = '0.9.0';

// Fallback configuration
export const FALLBACK_CONFIG = {
  retryAttempts: 3,
  retryDelay: 1000, // ms
  timeout: 10000, // ms
};