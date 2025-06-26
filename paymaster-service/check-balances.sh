#!/bin/bash

echo "🔍 CHECKING TEST ACCOUNT BALANCES"
echo "=================================="

TIPPER_ADDR="0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb"
CREATOR_ADDR="0x07a8472b469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e"
STRK_CONTRACT="0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
RPC_URL="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

echo "👤 TIPPER ACCOUNT ($TIPPER_ADDR):"
echo -n "   ETH Balance: "
starkli balance $TIPPER_ADDR --rpc $RPC_URL 2>/dev/null || echo "❌ Error"
echo -n "   STRK Balance: "
starkli call $STRK_CONTRACT balanceOf $TIPPER_ADDR --rpc $RPC_URL 2>/dev/null | head -1 || echo "❌ Error"

echo ""
echo "👤 CREATOR ACCOUNT ($CREATOR_ADDR):"
echo -n "   ETH Balance: "
starkli balance $CREATOR_ADDR --rpc $RPC_URL 2>/dev/null || echo "❌ Error"
echo -n "   STRK Balance: "
starkli call $STRK_CONTRACT balanceOf $CREATOR_ADDR --rpc $RPC_URL 2>/dev/null | head -1 || echo "❌ Error"

echo ""
echo "💡 To fund accounts, visit:"
echo "   🚰 https://starknet-faucet.vercel.app/"
echo "   🚰 https://blastapi.io/faucets/starknet-sepolia-strk"
