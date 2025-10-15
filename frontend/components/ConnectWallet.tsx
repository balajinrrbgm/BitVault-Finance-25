import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { Wallet, LogOut, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const ConnectWallet: React.FC = () => {
  const { address, isConnected, status } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Add error handling for wallet account changes
    const handleError = (event: any) => {
      if (event.error && event.error.message?.includes('Cannot read properties of undefined')) {
        console.warn('Wallet account change error caught and handled:', event.error);
        setConnectionError('Wallet state syncing...');
        setTimeout(() => setConnectionError(null), 3000);
      }
    };

    // Listen for potential wallet errors
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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

  const handleConnect = async (connector: any) => {
    try {
      setConnectionError(null);
      console.log('🔗 Attempting to connect with:', connector.name);
      
      // Add small delay to prevent rapid connection attempts
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await connect({ connector });
      setShowDropdown(false);
      console.log('✅ Wallet connected successfully');
    } catch (error: any) {
      console.error('❌ Failed to connect wallet:', error);
      
      // Handle specific error types
      if (error.message?.includes('Cannot read properties of undefined')) {
        setConnectionError('Wallet account sync issue. Please try refreshing the page.');
      } else if (error.message?.includes('User rejected')) {
        setConnectionError('Connection cancelled by user.');
      } else {
        setConnectionError('Failed to connect wallet. Please try again.');
      }
      
      // Clear error after 5 seconds
      setTimeout(() => setConnectionError(null), 5000);
    }
  };

  const handleDisconnect = () => {
    try {
      console.log('🔌 Disconnecting wallet...');
      disconnect();
      setShowDropdown(false);
      setConnectionError(null);
      console.log('✅ Wallet disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
      // Force close dropdown even if disconnect fails
      setShowDropdown(false);
      setConnectionError(null);
    }
  };

  if (!mounted) {
    return (
      <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30">
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Connection pending state
  if (isPending || status === 'connecting') {
    return (
      <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 opacity-75 cursor-not-allowed">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Connecting...</span>
      </button>
    );
  }

  // Connected state
  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105 transition-all duration-200"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <span className="sm:hidden">Connected</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-semibold">Wallet Connected</p>
              </div>
              <p className="font-mono text-sm text-gray-900 break-all">{address}</p>
              <p className="text-xs text-gray-600 mt-1">
                Status: {status}
              </p>
            </div>
            
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected - show connect options
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 transition-all duration-200"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Connect Wallet</h3>
            <p className="text-sm text-gray-600">Choose your preferred wallet</p>
          </div>

          {connectionError && (
            <div className="p-3 bg-red-50 border-b border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{connectionError}</span>
              </div>
            </div>
          )}

          <div className="p-2">
            {connectors.length > 0 ? (
              connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={!connector.available()}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{connector.name}</div>
                    <div className="text-xs text-gray-500">
                      {connector.available() ? 'Available' : 'Not installed'}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">No wallets detected</p>
                <p className="text-xs text-gray-500">
                  Please install Braavos or ArgentX wallet extension
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              New to Starknet? 
              <a 
                href="https://braavos.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 ml-1 font-semibold"
              >
                Download Braavos
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
