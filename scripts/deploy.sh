#!/bin/bash

# TipMeme Contract Deployment Script
# Deploys to Starknet Sepolia Testnet

set -e

echo "🚀 Starting TipMeme Contract Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NETWORK="testnet"
CONTRACT_NAME="TipMeme"

# Build the contract first
echo -e "${YELLOW}📦 Building contract...${NC}"
scarb build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Check if account exists and has funds
echo -e "${YELLOW}🔍 Checking account setup...${NC}"

# Get account info
ACCOUNT_ADDRESS=$(sncast account list | grep "tipmeme_account" | awk '{print $3}' || echo "")

if [ -z "$ACCOUNT_ADDRESS" ]; then
    echo -e "${RED}❌ Account 'tipmeme_account' not found${NC}"
    echo "Please create an account first:"
    echo "sncast account create --name tipmeme_account"
    exit 1
fi

echo -e "${GREEN}✅ Account found: $ACCOUNT_ADDRESS${NC}"

# Check account balance
echo -e "${YELLOW}💰 Checking account balance...${NC}"
BALANCE=$(sncast call \
    --contract-address 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
    --function balanceOf \
    --calldata $ACCOUNT_ADDRESS \
    --network $NETWORK 2>/dev/null | grep -o "0x[0-9a-fA-F]*" | head -1 || echo "0x0")

echo "Account balance: $BALANCE"

# Deploy the contract
echo -e "${YELLOW}🚀 Deploying TipMeme contract...${NC}"

# Owner address (use deployer address as initial owner)
OWNER_ADDRESS=$ACCOUNT_ADDRESS

echo "Deploying with owner: $OWNER_ADDRESS"

# Deploy using sncast
DEPLOY_RESULT=$(sncast deploy \
    --contract-name $CONTRACT_NAME \
    --constructor-calldata $OWNER_ADDRESS \
    --network $NETWORK \
    --max-fee 0.01 \
    2>&1)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo "$DEPLOY_RESULT"
    exit 1
fi

# Extract contract address from deploy result
CONTRACT_ADDRESS=$(echo "$DEPLOY_RESULT" | grep -o "contract_address: 0x[0-9a-fA-F]*" | cut -d' ' -f2)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}❌ Could not extract contract address${NC}"
    echo "$DEPLOY_RESULT"
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
  "owner_address": "$OWNER_ADDRESS",
  "network": "$NETWORK",
  "deployment_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "deployer_address": "$ACCOUNT_ADDRESS"
}
EOF

echo -e "${GREEN}✅ Deployment info saved to deployment-info.json${NC}"

# Verify the contract is working
echo -e "${YELLOW}🔍 Verifying contract deployment...${NC}"

# Test a simple call (check if paymaster is enabled - should be false initially)
PAYMASTER_STATUS=$(sncast call \
    --contract-address $CONTRACT_ADDRESS \
    --function is_paymaster_enabled \
    --network $NETWORK 2>/dev/null | grep -o "0x[0-9a-fA-F]*" | head -1 || echo "failed")

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
echo "Owner Address: $OWNER_ADDRESS"
echo "Starkscan URL: https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"
echo "=========================================="
echo -e "${NC}"

# Show next steps
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your Chrome extension configuration with:"
echo "   tipMemeContractAddress: '$CONTRACT_ADDRESS'"
echo ""
echo "2. Test the contract functions:"
echo "   sncast call --contract-address $CONTRACT_ADDRESS --function get_balance --calldata $OWNER_ADDRESS --network $NETWORK"
echo ""
echo "3. View on Starkscan:"
echo "   https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"

echo -e "${GREEN}🎯 TipMeme deployment complete!${NC}" 