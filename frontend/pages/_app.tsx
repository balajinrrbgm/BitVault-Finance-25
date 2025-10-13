import type { AppProps } from 'next/app';
import { StarknetConfig, publicProvider } from '@starknet-react/core';
import { Chain, goerli, mainnet } from '@starknet-react/chains';
import { ArgentMobileConnector } from 'starknetkit/argentMobile';
import { WebWalletConnector } from 'starknetkit/webwallet';
import '../styles/globals.css';

const chains: Chain[] = [mainnet, goerli];
const connectors = [
  new ArgentMobileConnector(),
  new WebWalletConnector({ url: "https://web.argent.xyz" }),
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
    >
      <Component {...pageProps} />
    </StarknetConfig>
  );
}

export default MyApp;
