#!/bin/bash

# BitVault Finance Deployment Script
echo "🚀 Deploying BitVault Finance to Starknet..."

# Build contracts
echo "📦 Building contracts..."
scarb build

# Deploy contracts in correct order
echo "🔨 Deploying contracts..."

# 1. Deploy BTC Bridge first
echo "Deploying BTC Bridge..."
BTC_BRIDGE=$(starkli declare target/dev/bitvault_finance_BTCBridge.contract_class.json --rpc $RPC_URL)

# 2. Deploy Vault Manager
echo "Deploying Vault Manager..."
VAULT_MANAGER=$(starkli declare target/dev/bitvault_finance_VaultManager.contract_class.json --rpc $RPC_URL)

# 3. Deploy Yield Optimizer
echo "Deploying Yield Optimizer..."
YIELD_OPTIMIZER=$(starkli declare target/dev/bitvault_finance_YieldOptimizer.contract_class.json --rpc $RPC_URL)

# 4. Deploy Privacy Mixer
echo "Deploying Privacy Mixer..."
PRIVACY_MIXER=$(starkli declare target/dev/bitvault_finance_PrivacyMixer.contract_class.json --rpc $RPC_URL)

echo "✅ All contracts deployed successfully!"
echo "BTC Bridge: $BTC_BRIDGE"
echo "Vault Manager: $VAULT_MANAGER"
echo "Yield Optimizer: $YIELD_OPTIMIZER"
echo "Privacy Mixer: $PRIVACY_MIXER"
