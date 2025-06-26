# 🔍 TipMeme Contract Event Monitor

**Real-time monitoring system for TipMeme contract events on Starknet Sepolia**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start live monitoring
node monitor-events.js monitor

# Run test suite
node test-monitoring.js test

# Check existing tips for @creatortest
node monitor-events.js check creatortest
```

## 📊 Contract Details

- **Contract Address**: `0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e`
- **Network**: Starknet Sepolia Testnet
- **Explorer**: [Voyager](https://sepolia.voyager.online/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)
- **RPC**: `https://starknet-sepolia.public.blastapi.io/rpc/v0_8`

## 🎯 Monitoring Features

### **Real-time Event Detection**
- ✅ Connects to Starknet testnet node
- ✅ Filters TipEvents for specific recipients
- ✅ Polls every 10 seconds for new events
- ✅ Handles network errors gracefully

### **Event Verification**
- ✅ Validates recipient handle (@creatortest)
- ✅ Verifies sender address exists
- ✅ Confirms token address matches expected
- ✅ Checks amount equals 1 TEST token
- ✅ Overall verification status

### **Contract Storage Analysis**
- ✅ Reads tip history from contract
- ✅ Calculates token balances per handle
- ✅ Shows recent transactions
- ✅ Verifies storage consistency

### **Explorer Integration**
- ✅ Generates Voyager transaction links
- ✅ Direct contract exploration links
- ✅ Block explorer integration
- ✅ Transaction verification URLs

## 🧪 Testing Workflow

### **1. Run Test Suite**
```bash
node test-monitoring.js test
```

**Expected Output:**
```
🧪 TipMeme Event Monitoring Test Suite
=====================================

🔌 Test 1: Starknet Connectivity
✅ Connected to Starknet sepolia
📊 Current block: 887422

🔄 Test 2: Handle Conversion  
✅ Conversion SUCCESS

🎭 Test 3: Event Simulation
🎯 TARGET EVENT FOUND! This tip is for @creatortest
🎯 OVERALL VERIFICATION: ✅ PASSED

🔗 Test 5: Explorer Links Generation
✅ Explorer links generated successfully
```

### **2. Start Live Monitoring**
```bash
node monitor-events.js monitor
```

**Console Output:**
```
🚀 TipMeme Event Monitor Starting...
=====================================
📡 Network: Starknet sepolia
📄 Contract: 0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e
🎯 Monitoring for @creatortest tips
🔍 Voyager Explorer: https://sepolia.voyager.online/contract/...
=====================================

📊 Starting from block: 887422
⏳ Waiting for new tip events...

🔍 Checking blocks 887423 to 887425...
```

### **3. Simulate Test Event**
```bash
node monitor-events.js simulate
```

## 🎯 Expected Output After Test Tip

When a real tip is sent to @creatortest, the monitor will display:

```javascript
🎉 NEW TIP EVENT DETECTED!
========================
📍 Block: 887456
🔗 Transaction: 0x789ef456gh123abc
👤 Recipient: @creatortest (felt: 0x63726561746f7274657374)
💰 Sender: 0x1234567890abcdef1234567890abcdef12345678
🪙 Token: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
💵 Amount: 1000000000000000000
⏰ Timestamp: 2025-06-25T22:45:00.000Z

🎯 TARGET EVENT FOUND! This tip is for @creatortest

🔍 VERIFYING EVENT DETAILS:
---------------------------
✅ Recipient Handle: ✓ Expected @creatortest
✅ Amount: ✓ Expected 1 TEST token
✅ Token Address: ✓ Expected TEST token  
✅ Sender Address: ✓ Valid tipper address

🎯 OVERALL VERIFICATION: ✅ PASSED

📊 CHECKING CONTRACT STORAGE:
-----------------------------
📝 Total Tips Count: 1
📋 Recent Tips:
  1. 1000000000000000000 tokens from 0x1234...5678
💰 Token Balances:
  0x04718f...7c938d: 1000000000000000000

🔗 VOYAGER EXPLORER LINKS:
---------------------------
📄 Transaction: https://sepolia.voyager.online/tx/0x789ef456gh123abc
📋 Contract: https://sepolia.voyager.online/contract/0x072a...2db9e
🧱 Block: https://sepolia.voyager.online/block/887456

🎯 SUCCESS! Event emission verified on Voyager: https://sepolia.voyager.online/tx/0x789ef456gh123abc
========================
```

## 📋 Verification Checklist

After receiving a test tip, the monitor verifies:

- ✅ **Button Injection**: TipMeme button appears on Twitter
- ✅ **Popup Functionality**: Extension popup opens with @creatortest
- ✅ **Wallet Connection**: ArgentX testnet wallet connected
- ✅ **Transaction Broadcast**: 1 TEST token sent successfully
- ✅ **Event Emission**: TipEvent detected in blockchain
- ✅ **Event Verification**: All event data matches expected values
- ✅ **Storage Update**: Contract storage reflects new tip
- ✅ **Explorer Verification**: Transaction visible on Voyager

## 🔧 Commands Reference

```bash
# Monitoring Commands
node monitor-events.js monitor          # Start live monitoring
node monitor-events.js simulate         # Simulate test event  
node monitor-events.js check [@handle]  # Check contract storage

# Testing Commands
node test-monitoring.js test             # Run complete test suite
node test-monitoring.js demo             # Show monitoring workflow
node test-monitoring.js output           # Show expected output format

# Package Commands
npm run monitor                          # Start monitoring
npm run simulate                         # Simulate event
npm run test                            # Run tests
```

## 🌐 Explorer Integration

### **Voyager Links Generated:**

- **Transaction**: `https://sepolia.voyager.online/tx/{tx_hash}`
- **Contract**: `https://sepolia.voyager.online/contract/{contract_address}`
- **Block**: `https://sepolia.voyager.online/block/{block_number}`

### **Live Contract Explorer:**
[View TipMeme Contract on Voyager](https://sepolia.voyager.online/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)

## 🚨 Troubleshooting

### **Connection Issues**
```bash
# Check network connectivity
curl -s https://starknet-sepolia.public.blastapi.io/rpc/v0_8

# Verify contract exists
node -e "const {RpcProvider} = require('starknet'); new RpcProvider({nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8'}).getContractVersion('0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e').then(console.log)"
```

### **Event Detection Issues**
- Ensure contract address is correct
- Check if events are being emitted
- Verify event filter parameters
- Monitor recent blocks for missed events

### **Handle Conversion Issues**  
- Twitter handles convert to felt252 using shortString encoding
- @creatortest → `0x63726561746f7274657374`
- Use consistent encoding across all components

## 🎯 Success Metrics

A successful monitoring session should show:

- ✅ **Connection**: < 2 seconds to connect to Starknet
- ✅ **Event Detection**: < 30 seconds after tip transaction
- ✅ **Verification**: 100% accuracy on event data validation
- ✅ **Storage Check**: Consistent contract storage updates
- ✅ **Explorer Links**: Valid, clickable Voyager URLs
- ✅ **Error Handling**: Graceful recovery from network issues

---

**🎉 Ready to monitor TipMeme events! Start with `npm run test` then `npm run monitor`**

*Last updated: June 2025 - Real-time Event Monitoring System ✅* 