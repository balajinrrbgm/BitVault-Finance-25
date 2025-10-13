import React from 'react';
import { ConnectWallet } from './ConnectWallet';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark text-white p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-dark font-bold">₿</span>
          </div>
          <h1 className="text-xl font-bold">BitVault Finance</h1>
        </div>

        <nav className="hidden md:flex space-x-6">
          <a href="#vaults" className="hover:text-primary transition-colors">Vaults</a>
          <a href="#bridge" className="hover:text-primary transition-colors">Bridge</a>
          <a href="#yield" className="hover:text-primary transition-colors">Yield</a>
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
        </nav>

        <ConnectWallet />
      </div>
    </header>
  );
};
