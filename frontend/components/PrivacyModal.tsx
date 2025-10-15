import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAccount } from '@starknet-react/core';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [showRecipient, setShowRecipient] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [secretNote, setSecretNote] = useState('');

  const handleMix = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (action === 'withdraw' && !recipientAddress) {
      alert('Please enter a recipient address');
      return;
    }

    setTxStatus('pending');

    // Simulate transaction and generate secret note
    setTimeout(() => {
      const mockNote = 'bitvault-' + Math.random().toString(36).substr(2, 32);
      setSecretNote(mockNote);
      setTxStatus('success');
      
      setTimeout(() => {
        setTxStatus('idle');
        if (action === 'deposit') {
          setAmount('');
        } else {
          setAmount('');
          setRecipientAddress('');
          setSecretNote('');
        }
      }, 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900">
            <div className="font-semibold mb-1">Privacy Mixer</div>
            <div className="text-purple-700">
              Break the link between sender and recipient addresses using zero-knowledge proofs.
              Deposit funds anonymously and withdraw to any address while preserving privacy.
            </div>
          </div>
        </div>
      </div>

      {/* Action Toggle */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-xl">
        <button
          onClick={() => setAction('deposit')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
            action === 'deposit'
              ? 'bg-white shadow-lg text-purple-600'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Deposit (Private)</span>
        </button>
        <button
          onClick={() => setAction('withdraw')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
            action === 'withdraw'
              ? 'bg-white shadow-lg text-purple-600'
              : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* How it Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
            <span className="font-bold text-purple-600">1</span>
          </div>
          <div className="font-semibold text-gray-900 mb-1">Deposit</div>
          <div className="text-gray-600 text-xs">
            Send BTC to the mixer and receive a secret note
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
            <span className="font-bold text-purple-600">2</span>
          </div>
          <div className="font-semibold text-gray-900 mb-1">Wait</div>
          <div className="text-gray-600 text-xs">
            Funds are mixed with others for anonymity
          </div>
        </div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
            <span className="font-bold text-purple-600">3</span>
          </div>
          <div className="font-semibold text-gray-900 mb-1">Withdraw</div>
          <div className="text-gray-600 text-xs">
            Use your secret note to withdraw to any address
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
            className="w-full px-4 py-3 pr-20 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg font-semibold"
            step="0.0001"
            min="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
            BTC
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Available: 0.00 BTC
        </div>
      </div>

      {/* Recipient Address (for withdrawals) */}
      {action === 'withdraw' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <div className="relative">
              <input
                type={showRecipient ? 'text' : 'password'}
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowRecipient(!showRecipient)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showRecipient ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              The recipient address will not be linked to your deposit
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Note (from Deposit)
            </label>
            <input
              type="text"
              value={secretNote}
              onChange={(e) => setSecretNote(e.target.value)}
              placeholder="bitvault-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              Use the secret note from your previous deposit
            </div>
          </div>
        </>
      )}

      {/* Privacy Notice */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-900">
            <div className="font-semibold mb-1">Important Security Notice</div>
            <ul className="text-yellow-700 space-y-1 list-disc list-inside">
              <li>Save your secret note securely - it cannot be recovered</li>
              <li>Wait at least 30 minutes between deposit and withdrawal</li>
              <li>Use different recipient addresses for maximum privacy</li>
              <li>Minimum deposit: 0.01 BTC, Maximum: 10 BTC</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
          <div className="text-sm text-yellow-900">
            {action === 'deposit' ? 'Depositing to mixer...' : 'Withdrawing privately...'}
          </div>
        </div>
      )}

      {txStatus === 'success' && action === 'deposit' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900 flex-1">
              <div className="font-semibold mb-2">Deposit Successful!</div>
              <div className="text-green-700 mb-3">
                Save this secret note to withdraw your funds later:
              </div>
              <div className="bg-white border border-green-300 rounded-lg p-3 font-mono text-xs break-all">
                {secretNote}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(secretNote)}
                className="mt-2 text-green-600 hover:text-green-700 font-semibold text-xs"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {txStatus === 'success' && action === 'withdraw' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <div className="font-semibold mb-1">Withdrawal Successful!</div>
              <div className="text-green-700">
                Funds have been sent privately to the recipient address.
                Your transaction is completely anonymous.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleMix}
        disabled={txStatus === 'pending' || !isConnected}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Shield className="w-5 h-5" />
        <span>
          {!isConnected ? 'Connect Wallet First' :
           txStatus === 'pending' ? 'Processing...' :
           action === 'deposit' ? 'Deposit Privately' : 'Withdraw Anonymously'}
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
