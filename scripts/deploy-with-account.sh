#!/bin/bash

# TipMeme Contract Deployment Script
# Deploys to Starknet Sepolia Testnet using your funded account

set -e

echo "🚀 Starting TipMeme Contract Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NETWORK_URL="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
ACCOUNT_ADDRESS="0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb"
CONTRACT_NAME="TipMeme"

# Check if private key is provided
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ Please set your private key as environment variable:${NC}"
    echo "export PRIVATE_KEY=your_private_key_here"
    echo "Then run this script again"
    exit 1
fi

echo -e "${GREEN}✅ Account: $ACCOUNT_ADDRESS${NC}"

# Build the contract first
echo -e "${YELLOW}📦 Building contract...${NC}"
scarb build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Create temporary keystore for starkli
echo -e "${YELLOW}🔑 Setting up keystore...${NC}"
TEMP_KEYSTORE="/tmp/deployer_keystore.json"

# Create keystore from private key
echo "$PRIVATE_KEY" | starkli signer keystore from-key $TEMP_KEYSTORE

# Declare the contract
echo -e "${YELLOW}📋 Declaring contract...${NC}"
CLASS_HASH=$(starkli declare target/dev/tipmeme_TipMeme.contract_class.json \
    --rpc $NETWORK_URL \
    --account $ACCOUNT_ADDRESS \
    --keystore $TEMP_KEYSTORE \
    --compiler-version 2.11.4 2>&1 | grep -o "0x[0-9a-fA-F]*" | tail -1)

if [ -z "$CLASS_HASH" ]; then
    echo -e "${RED}❌ Declaration failed${NC}"
    rm -f $TEMP_KEYSTORE
    exit 1
fi

echo -e "${GREEN}✅ Contract declared with class hash: $CLASS_HASH${NC}"

# Deploy the contract
echo -e "${YELLOW}🚀 Deploying contract...${NC}"

# Deploy with the account address as the owner
CONTRACT_ADDRESS=$(starkli deploy $CLASS_HASH $ACCOUNT_ADDRESS \
    --rpc $NETWORK_URL \
    --account $ACCOUNT_ADDRESS \
    --keystore $TEMP_KEYSTORE 2>&1 | grep -o "0x[0-9a-fA-F]*" | tail -1)

# Clean up keystore
rm -f $TEMP_KEYSTORE

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
echo -e "${GREEN}📍 Contract Address: $CONTRACT_ADDRESS${NC}"

# Save deployment info
echo -e "${YELLOW}💾 Saving deployment info...${NC}"

cat > deployment-info.json << EOF
{
  "contract_name": "$CONTRACT_NAME",
  "contract_address": "$CONTRACT_ADDRESS",
  "class_hash": "$CLASS_HASH",
  "owner_address": "$ACCOUNT_ADDRESS",
  "network": "sepolia",
  "network_url": "$NETWORK_URL",
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo -e "${GREEN}✅ Deployment info saved to deployment-info.json${NC}"

# Verify the contract is working
echo -e "${YELLOW}🔍 Verifying contract deployment...${NC}"

# Test a simple call
PAYMASTER_STATUS=$(starkli call $CONTRACT_ADDRESS is_paymaster_enabled \
    --rpc $NETWORK_URL 2>/dev/null | grep -o "0x[0-9a-fA-F]*" | head -1 || echo "failed")

if [ "$PAYMASTER_STATUS" = "0x0" ]; then
    echo -e "${GREEN}✅ Contract verification successful (paymaster disabled as expected)${NC}"
else
    echo -e "${YELLOW}⚠️  Contract deployed but verification unclear${NC}"
fi

# Display deployment summary
echo -e "${GREEN}"
echo "=========================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "=========================================="
echo "Contract Name: $CONTRACT_NAME"
echo "Network: Starknet Sepolia Testnet"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Class Hash: $CLASS_HASH"
echo "Owner Address: $ACCOUNT_ADDRESS"
echo "Starkscan URL: https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"
echo "=========================================="
echo -e "${NC}"

# Show next steps
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your Chrome extension configuration with:"
echo "   tipMemeContractAddress: '$CONTRACT_ADDRESS'"
echo ""
echo "2. Test the contract functions:"
echo "   starkli call $CONTRACT_ADDRESS get_balance $ACCOUNT_ADDRESS --rpc $NETWORK_URL"
echo ""
echo "3. View on Starkscan:"
echo "   https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"

echo -e "${GREEN}🎯 TipMeme deployment complete!${NC}" 