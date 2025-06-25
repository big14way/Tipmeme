#!/bin/bash

# Simple deployment script for TipMeme contract
set -e

echo "🚀 Deploying TipMeme Contract..."

ACCOUNT_ADDRESS="0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb"
RPC_URL="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

# Build contract
echo "📦 Building contract..."
scarb build

# Since the account exists and is funded, let's try direct deployment
echo "🚀 Declaring contract..."

# First check if we can use the account for sncast
export STARKNET_ACCOUNT_ADDRESS=$ACCOUNT_ADDRESS
export STARKNET_RPC_URL=$RPC_URL

sncast declare --contract-name TipMeme --url $RPC_URL --account-address $ACCOUNT_ADDRESS || echo "Declaration may need manual setup"

echo "ℹ️  If this fails, you need STRK tokens for fees."
echo "Get STRK from: https://starknet-faucet.vercel.app/"
echo "Use your address: $ACCOUNT_ADDRESS" 