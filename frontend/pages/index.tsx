import React from 'react';
import { Header } from '../components/Header';
import { VaultCard } from '../components/VaultCard';
import { ClientOnly } from '../components/ClientOnly';
import { TestnetHelper } from '../components/TestnetHelper';
import { TrendingUp, Shield, Zap, Bitcoin, Lock, Coins, Sparkles, ArrowRight, BarChart3, Users } from 'lucide-react';

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

  // Button handlers
  const handleLaunchApp = () => {
    // Scroll to vaults section
    document.getElementById('vaults')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    window.open('https://starknet.io/', '_blank');
  };

  const handleCreateVault = () => {
    alert('Create Vault feature coming soon! This will open a modal to create a new vault.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium">Powered by Starknet</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Bitcoin DeFi <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Bridge your Bitcoin to Starknet for <span className="text-orange-400 font-semibold">yield farming</span>, 
              <span className="text-blue-400 font-semibold"> privacy-preserving</span> transactions, 
              and <span className="text-green-400 font-semibold">automated</span> portfolio optimization.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleLaunchApp}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Launch App</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleLearnMore}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-400 mb-1">$2.4M</div>
                <div className="text-sm text-gray-400">Total TVL</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400 mb-1">8.7%</div>
                <div className="text-sm text-gray-400">Avg APY</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400 mb-1">156</div>
                <div className="text-sm text-gray-400">Vaults</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">1.2K</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why BitVault Finance?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most advanced Bitcoin DeFi platform on Starknet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
                  <Bitcoin className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Bitcoin Bridge</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trustless bridge for moving Bitcoin to Starknet using atomic swaps and SPV proofs. Secure, fast, and decentralized.
                </p>
                <div className="mt-4 flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Yield Optimization</h3>
                <p className="text-gray-700 leading-relaxed">
                  Automated yield farming across multiple protocols with AI-powered rebalancing. Maximize returns with minimal effort.
                </p>
                <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Privacy Layer</h3>
                <p className="text-gray-700 leading-relaxed">
                  Zero-knowledge transaction mixing for anonymous and untraceable transfers. Your privacy is our priority.
                </p>
                <div className="mt-4 flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Lock className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Secure</h4>
                <p className="text-sm text-gray-600">Audited contracts</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Fast</h4>
                <p className="text-sm text-gray-600">Lightning speed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Coins className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Low Fees</h4>
                <p className="text-sm text-gray-600">Minimal costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vaults Section */}
      <section id="vaults" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Vaults
              </h2>
              <p className="text-gray-600">Manage your Bitcoin yield strategies</p>
            </div>
            <button 
              onClick={handleCreateVault}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Create New Vault</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVaults.map(vault => (
              <VaultCard key={vault.id} {...vault} />
            ))}
          </div>

          {/* Empty State or CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-600 bg-white px-6 py-3 rounded-xl shadow-md">
              <Users className="w-5 h-5" />
              <span>Join 1,200+ users earning passive income</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-gray-600">Real-time metrics from our ecosystem</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-orange-600 mb-2">$2.4M</div>
              <div className="text-sm md:text-base text-gray-700 font-medium">Total Value Locked</div>
              <div className="mt-2 text-xs text-green-600 font-semibold">↑ 12.3% this week</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">156</div>
              <div className="text-sm md:text-base text-gray-700 font-medium">Active Vaults</div>
              <div className="mt-2 text-xs text-green-600 font-semibold">↑ 8 new today</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-green-600 mb-2">8.7%</div>
              <div className="text-sm md:text-base text-gray-700 font-medium">Average APY</div>
              <div className="mt-2 text-xs text-green-600 font-semibold">Best: 15.2%</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl md:text-5xl font-black text-purple-600 mb-2">99.9%</div>
              <div className="text-sm md:text-base text-gray-700 font-medium">Uptime</div>
              <div className="mt-2 text-xs text-green-600 font-semibold">100% Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bitcoin className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  BitVault Finance
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The most advanced Bitcoin DeFi platform on Starknet. Bridge, earn, and grow your Bitcoin with complete security and privacy.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Vaults</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Bridge</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Yield</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Whitepaper</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Audit Reports</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 BitVault Finance. Built with ❤️ on Starknet for the Bitcoin ecosystem.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Testnet Helper */}
      <ClientOnly>
        <TestnetHelper />
      </ClientOnly>
    </div>
  );
};

export default HomePage;
