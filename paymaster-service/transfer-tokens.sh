#!/bin/bash

# Configuration
TIPPER_ADDR="0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb"
CREATOR_ADDR="0x07a8472b469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e"
STRK_CONTRACT="0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
RPC_URL="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

echo "💰 TOKEN TRANSFER SCRIPT"
echo "======================="

# Check if private keys are set
if [ -z "$TIPPER_PRIVATE_KEY" ] || [ -z "$CREATOR_PRIVATE_KEY" ]; then
    echo "❌ Error: Private keys not set!"
    echo "Please set TIPPER_PRIVATE_KEY and CREATOR_PRIVATE_KEY environment variables"
    exit 1
fi

echo "✅ Private keys are set"

# Get current balances
echo "�� Current balances:"
echo -n "Tipper ETH: "
starkli balance $TIPPER_ADDR --rpc $RPC_URL 2>/dev/null || echo "Error"

echo -n "Tipper STRK: "
TIPPER_STRK=$(starkli call $STRK_CONTRACT balanceOf $TIPPER_ADDR --rpc $RPC_URL 2>/dev/null | head -1)
echo $TIPPER_STRK

echo -n "Creator ETH: "
starkli balance $CREATOR_ADDR --rpc $RPC_URL 2>/dev/null || echo "Error"

echo -n "Creator STRK: "
starkli call $STRK_CONTRACT balanceOf $CREATOR_ADDR --rpc $RPC_URL 2>/dev/null | head -1 || echo "Error"

# Create keystore for tipper (temporary)
echo ""
echo "🔑 Setting up temporary keystore for tipper..."
mkdir -p ~/.starkli-wallets/temp
echo $TIPPER_PRIVATE_KEY | starkli signer keystore from-key ~/.starkli-wallets/temp/tipper_keystore.json --force 2>/dev/null <<< "temp123"

# Create account descriptor for tipper
echo "📄 Creating account descriptor for tipper..."
starkli account fetch $TIPPER_ADDR --output ~/.starkli-wallets/temp/tipper_account.json --rpc $RPC_URL

echo ""
echo "💸 Calculating transfer amounts..."

# Calculate half of STRK balance (convert hex to decimal, divide by 2, convert back)
if [ "$TIPPER_STRK" != "0x0000000000000000000000000000000000000000000000000000000000000000" ]; then
    # Convert hex to decimal, divide by 2
    STRK_DECIMAL=$(printf "%d" "$TIPPER_STRK")
    HALF_STRK_DECIMAL=$((STRK_DECIMAL / 2))
    HALF_STRK_HEX=$(printf "0x%x" $HALF_STRK_DECIMAL)
    echo "Half STRK to transfer: $HALF_STRK_HEX ($HALF_STRK_DECIMAL in decimal)"
    
    echo ""
    echo "🚀 Transferring STRK tokens..."
    echo "From: $TIPPER_ADDR"
    echo "To: $CREATOR_ADDR"
    echo "Amount: $HALF_STRK_HEX"
    
    # Transfer STRK tokens
    starkli invoke $STRK_CONTRACT transfer $CREATOR_ADDR $HALF_STRK_HEX \
        --account ~/.starkli-wallets/temp/tipper_account.json \
        --keystore ~/.starkli-wallets/temp/tipper_keystore.json \
        --rpc $RPC_URL \
        --password temp123
else
    echo "⚠️ No STRK tokens to transfer"
fi

# Transfer some ETH (0.001 ETH = 1000000000000000 wei)
echo ""
echo "🚀 Transferring ETH..."
ETH_AMOUNT="0x38d7ea4c68000"  # 0.001 ETH in hex
echo "Amount: 0.001 ETH"

starkli transfer $CREATOR_ADDR $ETH_AMOUNT \
    --account ~/.starkli-wallets/temp/tipper_account.json \
    --keystore ~/.starkli-wallets/temp/tipper_keystore.json \
    --rpc $RPC_URL \
    --password temp123

echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf ~/.starkli-wallets/temp

echo ""
echo "✅ Transfer complete! Run ./check-balances.sh to verify"
