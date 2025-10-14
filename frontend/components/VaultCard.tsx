import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, ArrowUpRight, Activity } from 'lucide-react';
import { Modal } from './Modal';
import { VaultManagementModal } from './VaultManagementModal';

interface VaultCardProps {
  id: string;
  name: string;
  balance: string;
  apy: string;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
}

export const VaultCard: React.FC<VaultCardProps> = ({
  id,
  name,
  balance,
  apy,
  risk,
  status
}) => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'low':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          glow: 'shadow-green-500/20'
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          glow: 'shadow-yellow-500/20'
        };
      case 'high':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          glow: 'shadow-red-500/20'
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          glow: 'shadow-gray-500/20'
        };
    }
  };

  const riskConfig = getRiskConfig(risk);

  // Button handlers
  const handleManage = () => {
    setIsManageModalOpen(true);
  };

  const handleBoost = () => {
    alert(`Boost vault "${name}"!\n\nThis will:\n- Optimize yield strategy\n- Rebalance portfolio\n- Compound rewards\n\nComing soon!`);
  };

  return (
    <>
      <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-orange-300 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
      {/* Gradient Header */}
      <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500"></div>
      
      <div className="p-6">
        {/* Title Section */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 font-mono">Vault #{id}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
            status === 'active' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}>
            <Activity className="w-3 h-3" />
            <span>{status}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4 mb-6">
          {/* Balance */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600 font-medium">Balance</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{balance} BTC</span>
              <p className="text-xs text-gray-500" suppressHydrationWarning>
                ≈ ${(parseFloat(balance) * 45000).toLocaleString()}
              </p>
            </div>
          </div>

          {/* APY */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700 font-medium">APY</span>
            </div>
            <span className="text-lg font-bold text-green-600">{apy}%</span>
          </div>

          {/* Risk Level */}
          <div className={`flex justify-between items-center p-3 rounded-xl border ${riskConfig.bg} ${riskConfig.border}`}>
            <div className="flex items-center space-x-2">
              <Shield className={`w-4 h-4 ${riskConfig.color}`} />
              <span className="text-sm text-gray-700 font-medium">Risk Level</span>
            </div>
            <span className={`font-bold ${riskConfig.color} capitalize`}>
              {risk}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={handleManage}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 transition-all duration-200"
          >
            <span>Manage</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleBoost}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group/btn"
            title="Boost vault performance"
          >
            <Zap className="w-5 h-5 text-gray-600 group-hover/btn:text-orange-600 transition-colors" />
          </button>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">24h Performance</span>
            <span className="text-green-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+2.4%</span>
            </span>
          </div>
        </div>
      </div>
    </div>

      {/* Vault Management Modal */}
      {isManageModalOpen && (
        <Modal 
          isOpen={isManageModalOpen} 
          onClose={() => setIsManageModalOpen(false)} 
          title={`Manage ${name}`}
          size="lg"
        >
          <VaultManagementModal
            vaultName={name}
            vaultId={id}
            balance={balance}
            apy={apy}
            risk={risk}
            onClose={() => setIsManageModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};
