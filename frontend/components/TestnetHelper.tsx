import React, { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Coins, ExternalLink, Gift, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

interface TestnetHelperProps {
  onBalanceUpdate?: (balance: string) => void;
}

export const TestnetHelper: React.FC<TestnetHelperProps> = ({ onBalanceUpdate }) => {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [mockBalance, setMockBalance] = useState('0.001');
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address && typeof navigator !== 'undefined') {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const addMockTokens = (amount: string) => {
    const newBalance = (parseFloat(mockBalance) + parseFloat(amount)).toString();
    setMockBalance(newBalance);
    onBalanceUpdate?.(newBalance);
    alert(`Added ${amount} test BTC to your balance!\nNew Balance: ${newBalance} BTC`);
  };

  const faucets = [
    {
      name: 'Starknet Sepolia ETH Faucet',
      url: 'https://starknet-faucet.vercel.app/',
      description: 'Get ETH for gas fees on Starknet Sepolia',
      token: 'ETH'
    },
    {
      name: 'Alchemy Starknet Faucet',
      url: 'https://www.alchemy.com/faucets/starknet-sepolia',
      description: 'Alternative ETH faucet for Starknet',
      token: 'ETH'
    },
    {
      name: 'BlastAPI Sepolia RPC v0.9',
      url: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_9',
      description: 'Primary RPC endpoint (v0.9.0 compatible)',
      token: 'RPC'
    },
    {
      name: 'Nethermind Free RPC v0.9',
      url: 'https://free-rpc.nethermind.io/sepolia-juno/v0_9',
      description: 'Alternative free RPC endpoint (v0.9.0)',
      token: 'RPC'
    },
    {
      name: 'Bitcoin Testnet Faucet',
      url: 'https://bitcoinfaucet.uo1.net/',
      description: 'Get Bitcoin testnet coins',
      token: 'tBTC'
    },
    {
      name: 'Coinfaucet Bitcoin Testnet',
      url: 'https://coinfaucet.eu/en/btc-testnet/',
      description: 'Another Bitcoin testnet faucet',
      token: 'tBTC'
    }
  ];

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        title="Testnet Helper"
      >
        <Gift className="w-6 h-6" />
      </button>

      {/* Helper Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Testnet Helper</h3>
            </div>
            <p className="text-sm text-gray-600">Get test tokens for development</p>
          </div>

          {/* Wallet Info */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Connected Wallet</div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-gray-900 break-all">
                {address?.slice(0, 10)}...{address?.slice(-8)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-200 rounded"
                title="Copy address"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-green-600">
              Mock Balance: {mockBalance} BTC
            </div>
          </div>

          {/* Quick Mock Tokens */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Test Tokens</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addMockTokens('0.01')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                +0.01 BTC
              </button>
              <button
                onClick={() => addMockTokens('0.1')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                +0.1 BTC
              </button>
              <button
                onClick={() => addMockTokens('1.0')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                +1.0 BTC
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              These are mock tokens for testing UI functionality
            </div>
          </div>

          {/* Real Faucets */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Real Testnet Faucets</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {faucets.map((faucet, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-gray-900 text-sm">{faucet.name}</div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {faucet.token}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{faucet.description}</p>
                  <a
                    href={faucet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-semibold"
                  >
                    <span>Open Faucet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <div className="font-semibold mb-1">Testing Instructions:</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use mock tokens for UI testing</li>
                  <li>Get real testnet ETH for gas fees</li>
                  <li>Switch wallet to Sepolia/Sepolia-Alpha testnet</li>
                  <li>Transactions won't affect mainnet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};