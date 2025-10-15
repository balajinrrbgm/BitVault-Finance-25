import type { AppProps } from 'next/app';
import { StarknetConfig, jsonRpcProvider, argent, braavos } from '@starknet-react/core';
import { sepolia, mainnet } from '@starknet-react/chains';
import { Chain } from '@starknet-react/chains';
import { WalletErrorBoundary } from '../components/WalletErrorBoundary';
import '../styles/globals.css';

// Create sepolia-alpha variant using the same chain ID as sepolia but different network name
const sepoliaAlpha: Chain = {
  ...sepolia,
  name: 'Starknet Sepolia Alpha',
  network: 'sepolia-alpha',
  rpcUrls: {
    default: {
      http: ['https://starknet-sepolia.public.blastapi.io/rpc/v0_9'],
    },
    public: {
      http: ['https://starknet-sepolia.public.blastapi.io/rpc/v0_9'],
    },
  },
};

const chains = [sepoliaAlpha, sepolia, mainnet];

// Configure connectors - keeping simple to avoid account handling errors
const connectors = [
  braavos(),
  argent(),
];

// Configure provider with explicit sepolia-alpha network support
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    console.log('🔧 RPC Provider Debug:', {
      chainId: chain.id.toString(),
      chainName: chain.name,
      chainNetwork: chain.network,
      isTestnet: chain.testnet,
      forceSepolia: process.env.NEXT_PUBLIC_FORCE_SEPOLIA
    });

    // Get RPC URLs
    const sepoliaRpcUrl = process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_9';
    const mainnetRpcUrl = process.env.NEXT_PUBLIC_STARKNET_MAINNET_RPC || 'https://starknet-mainnet.public.blastapi.io/rpc/v0_9';

    // Force sepolia if enabled
    if (process.env.NEXT_PUBLIC_FORCE_SEPOLIA === 'true') {
      console.log('🔴 FORCE SEPOLIA ENABLED - Using Sepolia RPC for all chains:', sepoliaRpcUrl);
      return { nodeUrl: sepoliaRpcUrl };
    }

    // Always use Sepolia RPC for any testnet or sepolia-related network
    if (
      chain.network === 'sepolia-alpha' || 
      chain.network === 'sepolia' ||
      chain.name?.toLowerCase().includes('sepolia') ||
      chain.testnet === true ||
      chain.id === sepolia.id ||
      chain.id === sepoliaAlpha.id
    ) {
      console.log('✅ Routing to Sepolia RPC:', sepoliaRpcUrl);
      return { nodeUrl: sepoliaRpcUrl };
    }

    // Only use mainnet for explicitly mainnet chains
    if (chain.network === 'mainnet' && chain.id === mainnet.id && !chain.testnet) {
      console.log('✅ Routing to Mainnet RPC:', mainnetRpcUrl);
      return { nodeUrl: mainnetRpcUrl };
    }

    // Default to sepolia for safety (since we're testing)
    console.log('⚠️ Unknown chain, defaulting to Sepolia RPC:', sepoliaRpcUrl);
    return { nodeUrl: sepoliaRpcUrl };
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletErrorBoundary>
      <StarknetConfig
        chains={chains}
        provider={provider}
        connectors={connectors}
        autoConnect={false}
      >
        <Component {...pageProps} />
      </StarknetConfig>
    </WalletErrorBoundary>
  );
}

export default MyApp;
