import React, { useState } from 'react';
import { TrendingUp, Zap, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useAccount } from '@starknet-react/core';

interface YieldModalProps {
  onClose: () => void;
}

interface Strategy {
  id: string;
  name: string;
  protocol: string;
  apy: string;
  tvl: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
}

export const YieldModal: React.FC<YieldModalProps> = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success'>('idle');

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Conservative Staking',
      protocol: 'StarkDefi',
      apy: '5.2',
      tvl: '$1.2M',
      risk: 'low',
      description: 'Low-risk staking with guaranteed returns'
    },
    {
      id: '2',
      name: 'Liquidity Mining',
      protocol: 'JediSwap',
      apy: '12.7',
      tvl: '$850K',
      risk: 'medium',
      description: 'Provide liquidity and earn trading fees'
    },
    {
      id: '3',
      name: 'Leveraged Yield',
      protocol: 'zkLend',
      apy: '18.5',
      tvl: '$2.5M',
      risk: 'high',
      description: 'High-yield leveraged farming strategy'
    },
    {
      id: '4',
      name: 'Auto-Compound',
      protocol: 'BitVault',
      apy: '8.9',
      tvl: '$620K',
      risk: 'low',
      description: 'Automated compounding for maximum efficiency'
    }
  ];

  const handleStake = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!selectedStrategy) {
      alert('Please select a yield strategy');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setTxStatus('pending');

    // Simulate transaction
    setTimeout(() => {
      setTxStatus('success');
      setTimeout(() => {
        setTxStatus('idle');
        setAmount('');
        setSelectedStrategy(null);
      }, 3000);
    }, 2000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <div className="font-semibold mb-1">Yield Optimization</div>
            <div className="text-green-700">
              Stake your BTC to earn passive income through various DeFi protocols on Starknet.
              Returns are automatically optimized for maximum efficiency.
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Selection */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Yield Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selectedStrategy?.id === strategy.id
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-gray-900">{strategy.name}</div>
                  <div className="text-sm text-gray-500">{strategy.protocol}</div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getRiskColor(strategy.risk)}`}>
                  {strategy.risk.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <div>
                  <div className="text-2xl font-black text-green-600">{strategy.apy}%</div>
                  <div className="text-xs text-gray-500">APY</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{strategy.tvl}</div>
                  <div className="text-xs text-gray-500">TVL</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">{strategy.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Strategy Details */}
      {selectedStrategy && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="font-semibold text-blue-900 mb-2">Selected Strategy: {selectedStrategy.name}</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-blue-700">Expected APY</div>
              <div className="font-bold text-blue-900">{selectedStrategy.apy}%</div>
            </div>
            <div>
              <div className="text-blue-700">Lock Period</div>
              <div className="font-bold text-blue-900">Flexible</div>
            </div>
            <div>
              <div className="text-blue-700">Min. Deposit</div>
              <div className="font-bold text-blue-900">0.001 BTC</div>
            </div>
            <div>
              <div className="text-blue-700">Rewards</div>
              <div className="font-bold text-blue-900">Daily</div>
            </div>
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Stake
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            disabled={!selectedStrategy}
            className="w-full px-4 py-3 pr-20 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold disabled:bg-gray-100 disabled:cursor-not-allowed"
            step="0.0001"
            min="0"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
            BTC
          </div>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-500">Available: 0.00 BTC</span>
          {selectedStrategy && amount && parseFloat(amount) > 0 && (
            <span className="text-green-600 font-semibold">
              Est. Returns: {(parseFloat(amount) * parseFloat(selectedStrategy.apy) / 100).toFixed(6)} BTC/year
            </span>
          )}
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus === 'pending' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
          <div className="text-sm text-yellow-900">
            Staking in progress...
          </div>
        </div>
      )}

      {txStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <div className="font-semibold mb-1">Successfully Staked!</div>
              <div className="text-green-700">
                Your BTC is now earning {selectedStrategy?.apy}% APY. 
                Rewards will be distributed daily.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleStake}
        disabled={txStatus === 'pending' || !isConnected || !selectedStrategy}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <TrendingUp className="w-5 h-5" />
        <span>
          {!isConnected ? 'Connect Wallet First' : 
           !selectedStrategy ? 'Select Strategy First' :
           txStatus === 'pending' ? 'Staking...' : 
           'Stake & Earn'}
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
