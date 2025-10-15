import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

export class WalletErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Wallet Error Boundary caught an error:', error, errorInfo);
    
    // Log specific wallet-related errors
    if (error.message.includes('Cannot read properties of undefined') || 
        error.message.includes('reading \'0\'') ||
        error.message.includes('InjectedConnector')) {
      console.error('🚨 Wallet Connection Error - This is likely a Braavos/ArgentX compatibility issue');
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold text-white">Wallet Connection Error</h1>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                There was an issue connecting to your wallet. This is usually a temporary compatibility issue.
              </p>
              
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                <h3 className="font-semibold text-red-300 mb-2">Common Causes:</h3>
                <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
                  <li>Braavos wallet extension update required</li>
                  <li>Network switching in progress</li>
                  <li>Wallet account state synchronization</li>
                  <li>Browser cache conflicts</li>
                </ul>
              </div>

              {this.state.error && (
                <details className="bg-gray-800/50 rounded p-3">
                  <summary className="text-sm text-gray-400 cursor-pointer">Technical Details</summary>
                  <pre className="text-xs text-gray-300 mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex-1 border-2 border-white/30 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Try Again
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-2">Quick Fix Steps:</h3>
              <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
                <li>Refresh this page</li>
                <li>Check your wallet is unlocked</li>
                <li>Ensure you're on Sepolia testnet</li>
                <li>Try disconnecting and reconnecting wallet</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}