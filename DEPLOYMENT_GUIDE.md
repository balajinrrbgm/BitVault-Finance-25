# BitVault Finance - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Cairo 1.0+ and Scarb installed
- Starknet Foundry for testing
- Starkli for contract deployment
- Node.js 18+ for frontend

### 1. Setup Environment

```bash
# Clone repository
git clone https://github.com/bitvault-finance/bitvault-finance.git
cd bitvault-finance

# Install Cairo dependencies
scarb build

# Setup frontend
cd frontend
npm install
cd ..
```

### 2. Configure Environment

```bash
# Create .env file
cat > .env << EOL
STARKNET_RPC_URL=https://starknet-goerli.infura.io/v3/YOUR_KEY
DEPLOYER_ACCOUNT_ADDRESS=0x...
DEPLOYER_PRIVATE_KEY=0x...
BTC_TOKEN_ADDRESS=0x...
EOL
```

### 3. Run Tests

```bash
# Run smart contract tests
snforge test

# Run frontend tests
cd frontend
npm test
cd ..
```

### 4. Deploy Contracts

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy to testnet
./scripts/deploy.sh testnet

# Deploy to mainnet (when ready)
./scripts/deploy.sh mainnet
```

### 5. Launch Frontend

```bash
cd frontend
npm run build
npm start
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Sufficient ETH in deployer account
- [ ] Contract addresses verified

### Smart Contract Deployment Order
1. [ ] Deploy BTC Bridge contract
2. [ ] Deploy Vault Manager contract  
3. [ ] Deploy Yield Optimizer contract
4. [ ] Deploy Privacy Mixer contract
5. [ ] Configure contract interactions
6. [ ] Verify on Starkscan

### Frontend Deployment
- [ ] Update contract addresses in config
- [ ] Build production bundle
- [ ] Deploy to hosting platform
- [ ] Configure domain and SSL
- [ ] Test wallet connections

### Post-Deployment
- [ ] Monitor contract interactions
- [ ] Set up analytics tracking
- [ ] Configure error monitoring
- [ ] Document contract addresses
- [ ] Share with community

## 🔧 Configuration Details

### Smart Contract Configuration
```cairo
// Vault Manager Configuration
const YIELD_RATE: u256 = 500; // 5% annual yield
const MIN_DEPOSIT: u256 = 1000000; // 0.01 BTC minimum

// BTC Bridge Configuration  
const MIN_CONFIRMATIONS: u256 = 6; // Bitcoin confirmations
const BRIDGE_FEE: u256 = 10; // 0.1% bridge fee

// Privacy Mixer Configuration
const DENOMINATION: u256 = 10000000; // 0.1 BTC denomination
const MERKLE_TREE_HEIGHT: u256 = 20; // Support for 1M deposits
```

### Frontend Configuration
```javascript
// Starknet Configuration
export const STARKNET_CONFIG = {
  chainId: '0x534e5f474f45524c49', // Goerli
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  contracts: {
    vaultManager: '0x...',
    btcBridge: '0x...',
    yieldOptimizer: '0x...',
    privacyMixer: '0x...'
  }
};
```

## 🔍 Verification Steps

### Contract Verification
```bash
# Verify BTC Bridge
starkli verify btc_bridge.cairo   --contract-address 0x...   --network goerli

# Verify other contracts similarly
```

### Frontend Testing
```bash
# Test wallet connections
npm run test:wallets

# Test contract interactions
npm run test:contracts

# Test mobile responsiveness
npm run test:mobile
```

## 🎯 Hackathon Submission Checklist

### Required Deliverables
- [x] **GitHub Repo**: Public repository with clear README
- [x] **Demo Video**: 3-minute video showing functionality
- [x] **Pitch Deck**: Professional presentation materials

### Bonus Materials
- [x] **Deployment Guide**: This comprehensive guide
- [x] **Technical Documentation**: Smart contract specs
- [x] **Mobile Demo**: Responsive design showcase
- [x] **Integration Demos**: Sponsor protocol integrations

### Prize-Specific Requirements

#### Xverse Integration
- [x] Native Bitcoin wallet connectivity
- [x] Transaction signing integration
- [x] Mobile wallet support

#### Atomiq Integration  
- [x] Cross-chain swap protocol
- [x] BTC/STRK swap functionality
- [x] Liquidity aggregation

#### VESU Integration
- [x] **Best UX Flow**: Intuitive interface design
- [x] **Best Mobile DeFi**: Mobile-optimized interactions
- [x] **Best Yield Wizard**: Automated optimization

#### Troves Integration
- [x] Yield aggregation services
- [x] Liquid staking integration
- [x] Portfolio diversification

#### OpenZeppelin Integration
- [x] Security contract libraries
- [x] Standardized implementations
- [x] Best practice adherence

## 📊 Monitoring & Analytics

### Contract Monitoring
```bash
# Monitor contract events
starkli events --contract 0x... --from-block latest

# Check contract state
starkli call --contract 0x... --function get_vault_info
```

### Frontend Analytics
- Google Analytics integration
- Wallet connection tracking
- Transaction success rates
- Mobile usage statistics

## 🐛 Troubleshooting

### Common Issues
1. **Contract deployment fails**: Check account balance and permissions
2. **Frontend won't connect**: Verify contract addresses in config
3. **Wallet integration issues**: Check network configuration
4. **Mobile display problems**: Test responsive breakpoints

### Debug Commands
```bash
# Debug contract deployment
starkli account deploy --dry-run

# Debug frontend build
npm run build --verbose

# Debug wallet connections  
npm run debug:wallets
```

## 📞 Support

For deployment issues or questions:
- **Email**: dev@bitvault.finance  
- **Discord**: BitVault Development Channel
- **GitHub Issues**: Repository issue tracker

---

**Successfully deployed? Share your experience and help improve this guide!**
