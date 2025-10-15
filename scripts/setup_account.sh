#!/bin/bash

# Account Setup Script for Starkli
# This script sets up the account configuration for deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starkli Account Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓ Loaded environment variables${NC}"
else
    echo -e "${RED}✗ .env file not found!${NC}"
    exit 1
fi

# Create wallet directory
WALLET_DIR="$HOME/.starkli-wallets/deployer"
mkdir -p "$WALLET_DIR"

# Fetch account configuration from network
echo -e "${YELLOW}Fetching account configuration from Starknet...${NC}"
starkli account fetch "$DEPLOYER_ACCOUNT_ADDRESS" \
    --rpc "$STARKNET_RPC_URL" \
    --output "$WALLET_DIR/account.json"

echo -e "${GREEN}✓ Account configuration saved at: $WALLET_DIR/account.json${NC}"

# Create a simple keystore file manually
echo -e "${YELLOW}Creating keystore file...${NC}"
cat > "$WALLET_DIR/keystore.json" << EOF
{
  "crypto": {
    "cipher": "aes-128-ctr",
    "cipherparams": {
      "iv": "00000000000000000000000000000000"
    },
    "ciphertext": "${DEPLOYER_PRIVATE_KEY#0x}",
    "kdf": "scrypt",
    "kdfparams": {
      "dklen": 32,
      "n": 8192,
      "p": 1,
      "r": 8,
      "salt": "00000000000000000000000000000000"
    },
    "mac": "0000000000000000000000000000000000000000000000000000000000000000"
  },
  "id": "00000000-0000-0000-0000-000000000000",
  "version": 3
}
EOF

echo -e "${GREEN}✓ Keystore created (Note: For production, use proper encryption!)${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Account file: $WALLET_DIR/account.json"
echo -e "Keystore file: $WALLET_DIR/keystore.json"
echo -e "\n${YELLOW}Note: The deployment script will use environment variables directly.${NC}"
echo -e "${GREEN}========================================${NC}"
