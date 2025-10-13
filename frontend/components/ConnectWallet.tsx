import React, { useState } from 'react';
import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';

export const ConnectWallet: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          {formatAddress(address)}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-primary text-dark px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
      >
        Connect Wallet
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
