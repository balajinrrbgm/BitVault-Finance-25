import React from 'react';
import { Header } from '../components/Header';
import { VaultCard } from '../components/VaultCard';
import { TrendingUp, Shield, Zap, Bitcoin } from 'lucide-react';

const HomePage: React.FC = () => {
  const mockVaults = [
    {
      id: '1',
      name: 'BTC Conservative',
      balance: '2.5',
      apy: '5.2',
      risk: 'low' as const,
      status: 'active' as const
    },
    {
      id: '2', 
      name: 'BTC Aggressive',
      balance: '1.8',
      apy: '12.7',
      risk: 'high' as const,
      status: 'active' as const
    },
    {
      id: '3',
      name: 'Mixed Assets',
      balance: '0.9',
      apy: '8.4',
      risk: 'medium' as const,
      status: 'active' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bitcoin DeFi <span className="text-primary">Reimagined</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bridge your Bitcoin to Starknet for yield farming, privacy-preserving transactions, 
            and automated portfolio optimization.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-primary text-dark px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
              Launch App
            </button>
            <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-dark transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why BitVault Finance?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bitcoin className="w-8 h-8 text-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bitcoin Bridge</h3>
              <p className="text-gray-600">
                Trustless bridge for moving Bitcoin to Starknet using atomic swaps and SPV proofs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Yield Optimization</h3>
              <p className="text-gray-600">
                Automated yield farming across multiple protocols with AI-powered rebalancing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy Layer</h3>
              <p className="text-gray-600">
                Zero-knowledge transaction mixing for anonymous and untraceable transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vaults Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">My Vaults</h2>
            <button className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
              Create Vault
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockVaults.map(vault => (
              <VaultCard key={vault.id} {...vault} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">$2.4M</div>
              <div className="text-gray-600">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">156</div>
              <div className="text-gray-600">Active Vaults</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">8.7%</div>
              <div className="text-gray-600">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-dark font-bold">₿</span>
            </div>
            <span className="text-xl font-bold">BitVault Finance</span>
          </div>
          <p className="text-gray-400 mb-4">
            Built with ❤️ on Starknet for the Bitcoin ecosystem
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary">Documentation</a>
            <a href="#" className="text-gray-400 hover:text-primary">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-primary">Discord</a>
            <a href="#" className="text-gray-400 hover:text-primary">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
