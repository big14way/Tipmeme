# TipMeme Contract Deployment Guide

Since we're encountering RPC compatibility issues with sncast, here are alternative deployment methods:

## Option 1: Deploy using Starkli (Recommended)

### Install Starkli
```bash
# Install starkli
curl https://get.starkli.sh | sh
starkliup
```

### Deploy with Starkli
```bash
# 1. Create/import account
starkli account oz init --keystore ~/.starkli-wallets/deployer

# 2. Build the contract
scarb build

# 3. Declare the contract
starkli declare target/dev/tipmeme_TipMeme.contract_class.json --keystore ~/.starkli-wallets/deployer --account ~/.starkli-wallets/deployer --network sepolia

# 4. Deploy the contract (replace CLASS_HASH with the hash from step 3)
starkli deploy CLASS_HASH OWNER_ADDRESS --keystore ~/.starkli-wallets/deployer --account ~/.starkli-wallets/deployer --network sepolia
```

## Option 2: Deploy via Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Install the Starknet plugin
3. Copy your Cairo contract code
4. Compile and deploy through the UI

## Option 3: Manual Deployment Script

Let's try a manual approach with working RPC endpoints:

### Step 1: Check Current Build Status
```bash
scarb build
```

### Step 2: Create Account Manually

Let me create a simplified deployment approach: 