import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Bitcoin, AlertCircle, CheckCircle2, Loader2, ExternalLink, Gift } from 'lucide-react';
import { useAccount } from '@starknet-react/core';

interface BridgeModalProps {
  onClose: () => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [direction, setDirection] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  const [mockBtcBalance, setMockBtcBalance] = useState('0.001');
  const [mockStarknetBalance, setMockStarknetBalance] = useState('0.000');

  // Load mock balances from localStorage
  useEffect(() => {
    const savedBtcBalance = localStorage.getItem('mockBtcBalance');
    const savedStarknetBalance = localStorage.getItem('mockStarknetBalance');
    if (savedBtcBalance) setMockBtcBalance(savedBtcBalance);
    if (savedStarknetBalance) setMockStarknetBalance(savedStarknetBalance);
  }, []);

  // Save balances to localStorage
  const updateBalances = (newBtcBalance: string, newStarknetBalance: string) => {
    setMockBtcBalance(newBtcBalance);
    setMockStarknetBalance(newStarknetBalance);
    localStorage.setItem('mockBtcBalance', newBtcBalance);
    localStorage.setItem('mockStarknetBalance', newStarknetBalance);
  };

  const addTestTokens = () => {
    const newBtcBalance = (parseFloat(mockBtcBalance) + 0.1).toFixed(6);
    updateBalances(newBtcBalance, mockStarknetBalance);
    alert('Added 0.1 test BTC to your balance!');
  };

  const handleBridge = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amountFloat = parseFloat(amount);
    const availableBalance = direction === 'deposit' ? parseFloat(mockBtcBalance) : parseFloat(mockStarknetBalance);

    if (amountFloat > availableBalance) {
      alert(`Insufficient balance. Available: ${availableBalance.toFixed(6)} ${direction === 'deposit' ? 'BTC' : 'Starknet BTC'}`);
      return;
    }

    if (direction === 'deposit' && !btcAddress) {
      alert('Please enter your Bitcoin address');
      return;
    }

    setTxStatus('pending');

    // Simulate realistic transaction timing
    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTxHash(mockTxHash);
      
      // Update balances after successful transaction
      if (direction === 'deposit') {
        const newBtcBalance = (parseFloat(mockBtcBalance) - amountFloat).toFixed(6);
        const newStarknetBalance = (parseFloat(mockStarknetBalance) + amountFloat).toFixed(6);
        updateBalances(newBtcBalance, newStarknetBalance);
      } else {
        const newBtcBalance = (parseFloat(mockBtcBalance) + amountFloat).toFixed(6);
        const newStarknetBalance = (parseFloat(mockStarknetBalance) - amountFloat).toFixed(6);
        updateBalances(newBtcBalance, newStarknetBalance);
      }
      
      setTxStatus('success');
      
      setTimeout(() => {
        setTxStatus('idle');
        setAmount('');
        setBtcAddress('');
      }, 5000);
    }, 3000); // Longer timing for realism
  };

  const switchDirection = () => {
    setDirection(direction === 'deposit' ? 'withdraw' : 'deposit');
    setAmount('');
    setBtcAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Testnet Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 flex-1">
            <div className="font-semibold mb-1">Testnet Mode Active</div>
            <div className="text-blue-700">
              You're using mock balances for testing. Real transactions require testnet tokens.
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <button
                onClick={addTestTokens}
                className="inline-flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                <Gift className="w-3 h-3" />
                <span>Add Test BTC</span>
              </button>
              <a
                href="https://starknet-faucet.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-semibold"
              >
                <span>Get ETH for Gas</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Bitcoin Balance</div>
          <div className="text-xl font-bold text-orange-600">{mockBtcBalance} BTC</div>
          <div className="text-xs text-gray-500">≈ ${(parseFloat(mockBtcBalance) * 45000).toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Starknet Balance</div>
          <div className="text-xl font-bold text-blue-600">{mockStarknetBalance} BTC</div>
          <div className="text-xs text-gray-500">≈ ${(parseFloat(mockStarknetBalance) * 45000).toLocaleString()}</div>
        </div>
      </div>
      {/* Direction Toggle */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
        <div className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all ${
          direction === 'deposit' 
            ? 'bg-white shadow-lg text-orange-600' 
            : 'text-gray-600 hover:bg-white/50'
        }`}>
          <button onClick={() => setDirection('deposit')} className="w-full">
            Deposit to Starknet
          </button>
        </div>
        <button 
          onClick={switchDirection}
          className="p-2 bg-white rounded-lg shadow hover:shadow-lg transition-all"
        >
          <ArrowDownUp className="w-5 h-5 text-orange-600" />
        </button>
        <div className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all ${
          direction === 'withdraw' 
            ? 'bg-white shadow-lg text-orange-600' 
            : 'text-gray-600 hover:bg-white/50'
        }`}>
          <button onClick={() => setDirection('withdraw')} className="w-full">
            Withdraw to Bitcoin
          </button>
        </div>
      </div>

      {/* From/To Display */}
      <div className="space-y-3">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-600 mb-2">From</div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">
                {direction === 'deposit' ? 'Bitcoin Network' : 'Starknet'}
              </div>
              <div className="text-sm text-gray-500">
                {direction === 'deposit' ? 'BTC Mainnet' : 'Layer 2'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-2 bg-white rounded-full shadow-md">
            <ArrowDownUp className="w-5 h-5 text-orange-600" />
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="text-sm text-blue-600 mb-2">To</div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">
                {direction === 'deposit' ? 'Starknet' : 'Bitcoin Network'}
              </div>
              <div className="text-sm text-gray-500">
                {direction === 'deposit' ? 'Layer 2' : 'BTC Mainnet'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 pr-20 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
            step="0.0001"
            min="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
            BTC
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Available: {direction === 'deposit' ? mockBtcBalance : mockStarknetBalance} {direction === 'deposit' ? 'BTC' : 'Starknet BTC'}
          <button
            onClick={() => setAmount(direction === 'deposit' ? mockBtcBalance : mockStarknetBalance)}
            className="ml-2 text-orange-600 font-semibold hover:text-orange-700 text-xs"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Bitcoin Address (for deposits) */}
      {direction === 'deposit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Bitcoin Address
          </label>
          <input
            type="text"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            placeholder="bc1q..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
          />
          <div className="mt-2 text-xs text-gray-500">
            Your BTC will be locked and wrapped tokens minted to your Starknet wallet
          </div>
        </div>
      )}

      {/* Recipient Address (for withdrawals) */}
      {direction === 'withdraw' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bitcoin Recipient Address
          </label>
          <input
            type="text"
            value={btcAddress}
            onChange={(e) => setBtcAddress(e.target.value)}
            placeholder="bc1q..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
          />
          <div className="mt-2 text-xs text-gray-500">
            Wrapped tokens will be burned and BTC sent to this address
          </div>
        </div>
      )}

      {/* Fee Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-semibold mb-1">Bridge Fees</div>
            <div className="space-y-1 text-blue-700">
              <div className="flex justify-between">
                <span>Network Fee:</span>
                <span className="font-medium">~0.0001 BTC</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge Fee:</span>
                <span className="font-medium">0.1%</span>
              </div>
              <div className="flex justify-between border-t border-blue-300 pt-1 mt-1">
                <span className="font-semibold">Estimated Time:</span>
                <span className="font-semibold">~30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
          <div className="text-sm text-yellow-900">
            Processing transaction...
          </div>
        </div>
      )}

      {txStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <div className="font-semibold mb-1">Transaction Successful!</div>
              <div className="text-green-700 mb-2 break-all">
                Tx Hash: {txHash}
              </div>
              <div className="text-green-700">
                {direction === 'deposit' 
                  ? `Successfully bridged ${amount} BTC to Starknet. Check your Starknet balance!`
                  : `Successfully bridged ${amount} BTC to Bitcoin network. Check your Bitcoin wallet!`
                }
              </div>
              <div className="mt-2 text-xs text-green-600">
                * This is a mock transaction for testing purposes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleBridge}
        disabled={txStatus === 'pending' || !isConnected}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
      >
        {!isConnected ? 'Connect Wallet First' : 
         txStatus === 'pending' ? 'Processing...' : 
         direction === 'deposit' ? 'Deposit BTC' : 'Withdraw BTC'}
      </button>

      {/* Connected Wallet Info */}
      {isConnected && address && (
        <div className="text-center text-sm text-gray-600">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
};
