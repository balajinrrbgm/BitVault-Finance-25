import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from '@starknet-react/core';
import { Bug, RefreshCw } from 'lucide-react';

export const NetworkDebugger: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const { chain } = useNetwork();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (chain) {
      setDebugInfo({
        chainId: chain.id?.toString(),
        chainName: chain.name,
        chainNetwork: chain.network,
        isTestnet: chain.testnet,
        rpcUrls: chain.rpcUrls,
        nativeCurrency: chain.nativeCurrency,
        timestamp: new Date().toISOString()
      });
    }
  }, [chain]);

  const testRpcConnection = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'starknet_chainId',
          id: 1
        })
      });
      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const [rpcTest, setRpcTest] = useState<any>(null);

  const testCurrentRpc = async () => {
    const sepoliaRpc = process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_9';
    const mainnetRpc = process.env.NEXT_PUBLIC_STARKNET_MAINNET_RPC || 'https://starknet-mainnet.public.blastapi.io/rpc/v0_9';
    
    const sepoliaResult = await testRpcConnection(sepoliaRpc);
    const mainnetResult = await testRpcConnection(mainnetRpc);
    
    setRpcTest({
      sepolia: { url: sepoliaRpc, ...sepoliaResult },
      mainnet: { url: mainnetRpc, ...mainnetResult }
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        title="Network Debugger"
      >
        <Bug className="w-5 h-5" />
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-96 bg-white rounded-lg shadow-xl border border-gray-300 p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Network Debug Info</h3>
            <button
              onClick={() => window.location.reload()}
              className="p-1 hover:bg-gray-100 rounded"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Chain Information */}
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-semibold mb-2">Current Chain</h4>
              {debugInfo ? (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">No chain detected</p>
              )}
            </div>

            {/* Wallet Info */}
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-semibold mb-2">Wallet Info</h4>
              <div className="text-xs space-y-1">
                <div><strong>Address:</strong> {address}</div>
                <div><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</div>
                <div><strong>Chain ID:</strong> {chainId?.toString()}</div>
              </div>
            </div>

            {/* RPC Test */}
            <div className="bg-yellow-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">RPC Test</h4>
                <button
                  onClick={testCurrentRpc}
                  className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700"
                >
                  Test RPCs
                </button>
              </div>
              {rpcTest && (
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Sepolia:</strong> {rpcTest.sepolia.success ? '✅' : '❌'}
                    <br />
                    <span className="text-gray-600">{rpcTest.sepolia.url}</span>
                  </div>
                  <div>
                    <strong>Mainnet:</strong> {rpcTest.mainnet.success ? '✅' : '❌'}
                    <br />
                    <span className="text-gray-600">{rpcTest.mainnet.url}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Environment Variables */}
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold mb-2">Environment</h4>
              <div className="text-xs space-y-1">
                <div><strong>Sepolia RPC:</strong> {process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC || 'Not set'}</div>
                <div><strong>Mainnet RPC:</strong> {process.env.NEXT_PUBLIC_STARKNET_MAINNET_RPC || 'Not set'}</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Troubleshooting</h4>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>Check if wallet is on Sepolia testnet</li>
              <li>Verify RPC endpoints are reachable</li>
              <li>Ensure sepolia-alpha maps to Sepolia RPC</li>
              <li>Clear browser cache and reload</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};