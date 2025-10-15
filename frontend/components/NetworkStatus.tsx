import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork } from '@starknet-react/core';
import { Wifi, WifiOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const { chain } = useNetwork();
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [rpcUrl, setRpcUrl] = useState<string>('');

  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        setNetworkStatus('checking');
        
        if (isConnected && chain) {
          setNetworkStatus('connected');
          
          // Get RPC URL for display based on chain
          const rpcUrl = (chain.name?.toLowerCase().includes('sepolia') || chain.network?.includes('sepolia'))
            ? process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_RPC || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_9'
            : process.env.NEXT_PUBLIC_STARKNET_MAINNET_RPC || 'https://starknet-mainnet.public.blastapi.io/rpc/v0_9';
          setRpcUrl(rpcUrl);
        } else {
          setNetworkStatus('disconnected');
        }
        
      } catch (error) {
        console.error('Network connection error:', error);
        setNetworkStatus('error');
      }
    };

    checkNetworkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkNetworkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, chain]);

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />;
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'checking':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'disconnected':
        return 'bg-gray-50 border-gray-200 text-gray-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusText = () => {
    switch (networkStatus) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return `Connected to ${chain?.name || 'Starknet'}`;
      case 'disconnected':
        return 'Not connected to network';
      case 'error':
        return 'Network connection error';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-30 p-3 rounded-xl border-2 shadow-lg max-w-sm ${getStatusColor()}`}>
      <div className="flex items-center space-x-2 mb-2">
        {getStatusIcon()}
        <span className="font-semibold text-sm">{getStatusText()}</span>
      </div>
      
      {isConnected && (
        <div className="text-xs space-y-1">
          <div><strong>Wallet:</strong> {address?.slice(0, 10)}...{address?.slice(-8)}</div>
          <div><strong>Network:</strong> {chain?.name || 'Unknown'}</div>
          <div><strong>Chain ID:</strong> {chainId?.toString() || 'Unknown'}</div>
          {rpcUrl && (
            <div className="mt-2 p-1 bg-white/50 rounded text-[10px] break-all">
              <strong>RPC:</strong> {rpcUrl}
            </div>
          )}
        </div>
      )}
      
      {networkStatus === 'error' && (
        <div className="mt-2 text-xs">
          <strong>Troubleshooting:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Check your internet connection</li>
            <li>Switch to Sepolia/Sepolia-Alpha testnet in wallet</li>
            <li>Try refreshing the page</li>
            <li>Check if RPC endpoint is working</li>
          </ul>
        </div>
      )}
    </div>
  );
};