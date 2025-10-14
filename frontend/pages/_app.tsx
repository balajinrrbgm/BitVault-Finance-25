import type { AppProps } from 'next/app';
import { StarknetConfig, publicProvider, argent, braavos } from '@starknet-react/core';
import { sepolia, mainnet } from '@starknet-react/chains';
import '../styles/globals.css';

const chains = [sepolia, mainnet];
const connectors = [
  braavos(),
  argent(),
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
      autoConnect={true}
    >
      <Component {...pageProps} />
    </StarknetConfig>
  );
}

export default MyApp;
