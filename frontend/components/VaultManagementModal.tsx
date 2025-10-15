import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Info, Loader2, CheckCircle2, Gift } from 'lucide-react';
import { useAccount } from '@starknet-react/core';

interface VaultManagementModalProps {
  vaultName: string;
  vaultId: string;
  balance: string;
  apy: string;
  risk: 'low' | 'medium' | 'high';
  onClose: () => void;
}

export const VaultManagementModal: React.FC<VaultManagementModalProps> = ({
  vaultName,
  vaultId,
  balance,
  apy,
  risk,
  onClose
}) => {
  const { address, isConnected } = useAccount();
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [mockWalletBalance, setMockWalletBalance] = useState('0.001');
  const [currentVaultBalance, setCurrentVaultBalance] = useState(balance);

  // Load mock wallet balance from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem('mockStarknetBalance') || '0.001';
    setMockWalletBalance(savedBalance);
  }, []);

  const addTestTokens = () => {
    const newBalance = (parseFloat(mockWalletBalance) + 0.05).toFixed(6);
    setMockWalletBalance(newBalance);
    localStorage.setItem('mockStarknetBalance', newBalance);
    alert('Added 0.05 test BTC to your wallet!');
  };

  const handleTransaction = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (action === 'withdraw' && parseFloat(amount) > parseFloat(currentVaultBalance)) {
      alert('Insufficient vault balance');
      return;
    }

    if (action === 'deposit' && parseFloat(amount) > parseFloat(mockWalletBalance)) {
      alert('Insufficient wallet balance');
      return;
    }

    setTxStatus('pending');

    // Simulate transaction
    setTimeout(() => {
      // Update balances after successful transaction
      if (action === 'deposit') {
        const newWalletBalance = (parseFloat(mockWalletBalance) - parseFloat(amount)).toFixed(6);
        const newVaultBalance = (parseFloat(currentVaultBalance) + parseFloat(amount)).toFixed(6);
        setMockWalletBalance(newWalletBalance);
        setCurrentVaultBalance(newVaultBalance);
        localStorage.setItem('mockStarknetBalance', newWalletBalance);
      } else {
        const newWalletBalance = (parseFloat(mockWalletBalance) + parseFloat(amount)).toFixed(6);
        const newVaultBalance = (parseFloat(currentVaultBalance) - parseFloat(amount)).toFixed(6);
        setMockWalletBalance(newWalletBalance);
        setCurrentVaultBalance(newVaultBalance);
        localStorage.setItem('mockStarknetBalance', newWalletBalance);
      }
      
      setTxStatus('success');
      setTimeout(() => {
        setTxStatus('idle');
        setAmount('');
      }, 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Test Token Helper */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-900">
            <span className="font-semibold">Wallet Balance:</span> {mockWalletBalance} BTC
          </div>
          <button
            onClick={addTestTokens}
            className="inline-flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            <Gift className="w-3 h-3" />
            <span>Add Test BTC</span>
          </button>
        </div>
      </div>
      {/* Vault Info */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{vaultName}</h3>
            <p className="text-sm text-gray-600 font-mono">Vault #{vaultId}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            risk === 'low' ? 'bg-green-100 text-green-700 border border-green-200' :
            risk === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
            'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {risk.toUpperCase()} RISK
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Current Balance</div>
            <div className="text-2xl font-bold text-gray-900">{currentVaultBalance} BTC</div>
            <div className="text-xs text-gray-500">≈ ${(parseFloat(currentVaultBalance) * 45000).toLocaleString()}</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="text-sm text-gray-700 mb-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>Current APY</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{apy}%</div>
            <div className="text-xs text-green-700">Est. {(parseFloat(balance) * parseFloat(apy) / 100).toFixed(6)} BTC/year</div>
          </div>
        </div>
      </div>

      {/* Action Toggle */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-xl">
        <button
          onClick={() => setAction('deposit')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
            action === 'deposit'
              ? 'bg-white shadow-lg text-green-600'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          <span>Deposit</span>
        </button>
        <button
          onClick={() => setAction('withdraw')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
            action === 'withdraw'
              ? 'bg-white shadow-lg text-orange-600'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
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
            className="w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
            step="0.0001"
            min="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
            BTC
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">
            {action === 'deposit' ? `Available: ${mockWalletBalance} BTC` : `In vault: ${currentVaultBalance} BTC`}
          </span>
          <button
            onClick={() => setAmount(action === 'deposit' ? mockWalletBalance : currentVaultBalance)}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      {amount && parseFloat(amount) > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 flex-1">
              <div className="font-semibold mb-2">Transaction Summary</div>
              <div className="space-y-1 text-blue-700">
                <div className="flex justify-between">
                  <span>{action === 'deposit' ? 'Depositing:' : 'Withdrawing:'}</span>
                  <span className="font-medium">{amount} BTC</span>
                </div>
                {action === 'deposit' && (
                  <>
                    <div className="flex justify-between">
                      <span>Expected Yearly Return:</span>
                      <span className="font-medium text-green-600">
                        {(parseFloat(amount) * parseFloat(apy) / 100).toFixed(6)} BTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Earnings:</span>
                      <span className="font-medium">
                        {(parseFloat(amount) * parseFloat(apy) / 100 / 365).toFixed(8)} BTC
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-t border-blue-300 pt-1 mt-1">
                  <span className="font-semibold">New Balance:</span>
                  <span className="font-semibold">
                    {action === 'deposit' 
                      ? (parseFloat(currentVaultBalance) + parseFloat(amount)).toFixed(4)
                      : (parseFloat(currentVaultBalance) - parseFloat(amount)).toFixed(4)
                    } BTC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {txStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
          <div className="text-sm text-yellow-900">
            {action === 'deposit' ? 'Depositing to vault...' : 'Withdrawing from vault...'}
          </div>
        </div>
      )}

      {txStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <div className="font-semibold mb-1">Transaction Successful!</div>
              <div className="text-green-700">
                {action === 'deposit' 
                  ? `Successfully deposited ${amount} BTC to ${vaultName}` 
                  : `Successfully withdrew ${amount} BTC from ${vaultName}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleTransaction}
        disabled={txStatus === 'pending' || !isConnected || !amount || parseFloat(amount) <= 0}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 ${
          action === 'deposit'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
        }`}
      >
        {action === 'deposit' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
        <span>
          {!isConnected ? 'Connect Wallet First' :
           txStatus === 'pending' ? 'Processing...' :
           action === 'deposit' ? 'Deposit to Vault' : 'Withdraw from Vault'}
        </span>
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
