'use client';

import { StarknetConfig, starkscan, useInjectedConnectors, argent, braavos, publicProvider } from '@starknet-react/core';
import { sepolia, mainnet } from '@starknet-react/chains';

const chains = [mainnet, sepolia];

export function Providers({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random"
  });

  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
      explorer={starkscan}
    >
      {children}
    </StarknetConfig>
  );
}