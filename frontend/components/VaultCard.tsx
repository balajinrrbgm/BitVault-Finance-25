import React from 'react';
import { TrendingUp, Shield, Zap } from 'lucide-react';

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
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Vault #{id}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Balance</span>
          <span className="font-semibold text-gray-800">{balance} BTC</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">APY</span>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-green-600">{apy}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Risk Level</span>
          <div className="flex items-center space-x-1">
            <Shield className={`w-4 h-4 ${getRiskColor(risk)}`} />
            <span className={`font-semibold ${getRiskColor(risk)}`}>
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <button className="flex-1 bg-primary text-dark py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
          Manage
        </button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
