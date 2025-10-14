# 🧪 BitVault Finance Testing Guide

## 🎯 Overview
This guide helps you test all DeFi operations with mock tokens and real testnet integration.

## 🚀 Quick Start Testing

### 1. **Start the Application**
```bash
npm run dev
```
Open `http://localhost:3000`

### 2. **Connect Your Braavos Wallet**
- Click "Connect Wallet"
- Select Braavos from the dropdown
- Make sure you're on **Sepolia Testnet** (not mainnet!)

### 3. **Get Test Tokens**

#### **Option A: Mock Tokens (Instant UI Testing)**
- Look for the floating **Gift 🎁** button (bottom-right corner)
- Click it to open the Testnet Helper
- Click **"+0.01 BTC"**, **"+0.1 BTC"**, or **"+1.0 BTC"** for instant mock tokens
- These are perfect for testing the UI and transaction flows

#### **Option B: Real Testnet Tokens**
1. **Get Starknet Sepolia ETH** (for gas fees):
   - Visit: https://starknet-faucet.vercel.app/
   - Enter your wallet address
   - Request ETH for gas fees

2. **Get Bitcoin Testnet** (for bridge testing):
   - Visit: https://bitcoinfaucet.uo1.net/
   - Or: https://coinfaucet.eu/en/btc-testnet/
   - Get Bitcoin testnet coins

## 🔬 Testing Scenarios

### **Bridge Testing**
1. **Deposit Bitcoin to Starknet:**
   - Header → Click "Bridge"
   - Select "Deposit to Starknet" 
   - Enter amount (use mock tokens first)
   - Watch balance transfer from Bitcoin to Starknet

2. **Withdraw from Starknet to Bitcoin:**
   - Switch to "Withdraw to Bitcoin"
   - Enter recipient Bitcoin address
   - Watch balance transfer back

### **Vault Management Testing**
1. **Deposit to Vault:**
   - Click "Manage" on any vault card
   - Select "Deposit" tab
   - Use your Starknet balance to deposit
   - Watch vault balance increase

2. **Withdraw from Vault:**
   - Select "Withdraw" tab
   - Enter amount from vault balance
   - Watch funds return to wallet

### **Yield Farming Testing**
1. **Stake for Yield:**
   - Header → Click "Yield"
   - Select a strategy (Conservative, Liquidity Mining, etc.)
   - Enter staking amount
   - Simulate earning rewards

### **Privacy Mixer Testing**
1. **Private Deposit:**
   - Header → Click "Privacy"
   - Select "Deposit (Private)"
   - Enter amount and get secret note
   - Save the secret note securely

2. **Anonymous Withdrawal:**
   - Select "Withdraw"
   - Enter secret note from previous deposit
   - Enter recipient address
   - Complete anonymous withdrawal

## 💡 Testing Tips

### **Mock Balance Features:**
- ✅ Balances persist in browser storage
- ✅ Realistic transaction timing (2-3 seconds)
- ✅ Balance updates reflect in all components
- ✅ "Add Test BTC" buttons throughout the app
- ✅ MAX buttons auto-fill available balance

### **Wallet Setup for Real Testing:**
1. **Switch to Sepolia Testnet** in Braavos:
   - Open Braavos wallet
   - Go to Settings → Networks
   - Select "Starknet Sepolia Testnet"

2. **Get your addresses:**
   - **Starknet Address**: Copy from wallet
   - **Bitcoin Testnet Address**: Get from any Bitcoin testnet wallet

### **Testing Checklist:**
- [ ] Wallet connects successfully
- [ ] Mock tokens can be added
- [ ] Bridge deposit works (Bitcoin → Starknet)
- [ ] Bridge withdraw works (Starknet → Bitcoin)
- [ ] Vault deposit increases vault balance
- [ ] Vault withdraw returns funds to wallet
- [ ] Yield staking simulates returns
- [ ] Privacy mixer generates secret notes
- [ ] All balances update correctly
- [ ] Transaction status shows properly

## 🔧 Troubleshooting

### **No Balance Shows:**
- Click the Gift 🎁 button and add mock tokens
- Check you're on the correct testnet
- Refresh the page

### **Wallet Won't Connect:**
- Make sure Braavos is installed and unlocked
- Switch to Sepolia testnet in wallet settings
- Try refreshing the page

### **Transactions Fail:**
- For real transactions: Ensure you have ETH for gas
- For mock transactions: Check you have sufficient mock balance
- Wait for previous transaction to complete

### **Mock Balances Reset:**
- Mock balances are saved in browser storage
- Clearing browser data will reset them
- Use "Add Test BTC" buttons to restore

## 🎯 Expected Behavior

### **Mock Transaction Flow:**
1. Enter amount → Check balance → Process (2-3s) → Update balances → Show success
2. All components share the same balance state
3. Realistic transaction hashes generated
4. Success messages with transaction details

### **Real Transaction Flow:**
1. Connect wallet → Get testnet tokens → Make transaction → Pay gas fees → See on-chain result

## 📝 Notes
- **Mock tokens** are perfect for UI/UX testing
- **Real testnet tokens** test actual blockchain integration
- All mock data is clearly labeled as "test/mock"
- Switch between mock and real testing as needed
- Balances are automatically saved and restored

## 🚀 Ready to Test!
Your BitVault Finance app now has comprehensive testing capabilities. Start with mock tokens for quick UI testing, then move to real testnet tokens for blockchain integration testing.

Happy testing! 🎉