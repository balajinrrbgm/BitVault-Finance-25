import React, { useState, useEffect } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { ClientOnly } from './ClientOnly';
import { Menu, X, Bitcoin } from 'lucide-react';
import { Modal } from './Modal';
import { BridgeModal } from './BridgeModal';
import { YieldModal } from './YieldModal';
import { PrivacyModal } from './PrivacyModal';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'bridge' | 'yield' | 'privacy' | null>(null);

  // Close mobile menu when modal opens
  useEffect(() => {
    if (activeModal) {
      setMobileMenuOpen(false);
    }
  }, [activeModal]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (section: 'vaults' | 'bridge' | 'yield' | 'privacy', e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (section === 'vaults') {
      const vaultsElement = document.getElementById('vaults');
      if (vaultsElement) {
        vaultsElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      setActiveModal(section);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md text-white border-b border-gray-800/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
                <Bitcoin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  BitVault Finance
                </h1>
                <p className="text-xs text-gray-400">Bitcoin DeFi on Starknet</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={(e) => handleNavClick('vaults', e)}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              >
                Vaults
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={(e) => handleNavClick('bridge', e)}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              >
                Bridge
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={(e) => handleNavClick('yield', e)}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              >
                Yield
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={(e) => handleNavClick('privacy', e)}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors duration-200 relative group"
              >
                Privacy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Wallet & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <ClientOnly>
                <ConnectWallet />
              </ClientOnly>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-800 space-y-3 animate-fade-in">
              <button 
                onClick={(e) => handleNavClick('vaults', e)} 
                className="block w-full text-left text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Vaults
              </button>
              <button 
                onClick={(e) => handleNavClick('bridge', e)} 
                className="block w-full text-left text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Bridge
              </button>
              <button 
                onClick={(e) => handleNavClick('yield', e)} 
                className="block w-full text-left text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Yield
              </button>
              <button 
                onClick={(e) => handleNavClick('privacy', e)} 
                className="block w-full text-left text-gray-300 hover:text-orange-400 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Privacy
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Modals */}
      {activeModal === 'bridge' && (
        <Modal isOpen={true} onClose={closeModal} title="Bitcoin Bridge" size="lg">
          <BridgeModal onClose={closeModal} />
        </Modal>
      )}

      {activeModal === 'yield' && (
        <Modal isOpen={true} onClose={closeModal} title="Yield Optimization" size="lg">
          <YieldModal onClose={closeModal} />
        </Modal>
      )}

      {activeModal === 'privacy' && (
        <Modal isOpen={true} onClose={closeModal} title="Privacy Mixer" size="lg">
          <PrivacyModal onClose={closeModal} />
        </Modal>
      )}
    </>
  );
};
