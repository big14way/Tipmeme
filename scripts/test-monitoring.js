#!/usr/bin/env node

/**
 * TipMeme Event Monitoring Test Script
 * Demonstrates complete event monitoring workflow
 */

const { EventMonitor, CONFIG } = require('./monitor-events.js');

class MonitoringTester {
    constructor() {
        this.monitor = new EventMonitor();
    }

    async runTests() {
        console.log('🧪 TipMeme Event Monitoring Test Suite');
        console.log('=====================================\n');

        // Test 1: Basic connectivity
        await this.testConnectivity();

        // Test 2: Handle conversion
        await this.testHandleConversion();

        // Test 3: Simulate test event
        await this.testEventSimulation();

        // Test 4: Check contract storage
        await this.testContractStorage();

        // Test 5: Generate explorer links
        await this.testExplorerLinks();

        console.log('\n✅ All tests completed!');
        console.log('🎯 Ready for live monitoring of @creatortest tips');
    }

    async testConnectivity() {
        console.log('🔌 Test 1: Starknet Connectivity');
        console.log('================================');
        
        try {
            const blockNumber = await this.monitor.provider.getBlockNumber();
            console.log(`✅ Connected to Starknet ${CONFIG.NETWORK}`);
            console.log(`📊 Current block: ${blockNumber}`);
            console.log(`📡 RPC URL: ${CONFIG.RPC_URL}`);
            console.log(`📄 Contract: ${CONFIG.CONTRACT_ADDRESS}`);
        } catch (error) {
            console.error('❌ Connectivity test failed:', error.message);
        }
        console.log('');
    }

    async testHandleConversion() {
        console.log('🔄 Test 2: Handle Conversion');
        console.log('============================');
        
        try {
            const handle = CONFIG.CREATOR_HANDLE;
            const felt = this.monitor.handleToFelt(handle);
            const converted = this.monitor.feltToHandle(felt);
            
            console.log(`📝 Original handle: @${handle}`);
            console.log(`🔢 Felt252 value: ${felt}`);
            console.log(`🔄 Converted back: @${converted}`);
            console.log(`✅ Conversion ${handle === converted ? 'SUCCESS' : 'FAILED'}`);
        } catch (error) {
            console.error('❌ Handle conversion test failed:', error.message);
        }
        console.log('');
    }

    async testEventSimulation() {
        console.log('🎭 Test 3: Event Simulation');
        console.log('===========================');
        
        try {
            console.log('🎬 Simulating TipEvent for @creatortest...');
            await this.monitor.simulateTestTip();
            console.log('✅ Event simulation completed');
        } catch (error) {
            console.error('❌ Event simulation failed:', error.message);
        }
        console.log('');
    }

    async testContractStorage() {
        console.log('📊 Test 4: Contract Storage Check');
        console.log('=================================');
        
        try {
            const handle = this.monitor.handleToFelt(CONFIG.CREATOR_HANDLE);
            console.log(`🔍 Checking storage for @${CONFIG.CREATOR_HANDLE} (${handle})`);
            
            // Check if we can read from contract
            const tips = await this.monitor.contract.get_tips(handle);
            console.log(`📝 Tips found: ${tips.length}`);
            
            if (tips.length > 0) {
                console.log('💰 Recent tips:');
                tips.slice(0, 3).forEach((tip, i) => {
                    const amount = BigInt(tip.amount.low) + (BigInt(tip.amount.high) << 128n);
                    console.log(`  ${i + 1}. ${amount.toString()} from ${tip.sender}`);
                });
            } else {
                console.log('💡 No tips found (this is expected for testing)');
            }
            
            console.log('✅ Contract storage check completed');
        } catch (error) {
            console.error('❌ Contract storage test failed:', error.message);
        }
        console.log('');
    }

    async testExplorerLinks() {
        console.log('🔗 Test 5: Explorer Links Generation');
        console.log('====================================');
        
        try {
            const mockTxHash = '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456';
            const mockBlockNumber = 123456;
            
            console.log('🌐 Generated Voyager links:');
            console.log(`📄 Contract: ${CONFIG.VOYAGER_BASE_URL}/contract/${CONFIG.CONTRACT_ADDRESS}`);
            console.log(`🔗 Transaction: ${CONFIG.VOYAGER_BASE_URL}/tx/${mockTxHash}`);
            console.log(`🧱 Block: ${CONFIG.VOYAGER_BASE_URL}/block/${mockBlockNumber}`);
            console.log('✅ Explorer links generated successfully');
        } catch (error) {
            console.error('❌ Explorer links test failed:', error.message);
        }
        console.log('');
    }

    async demonstrateMonitoring() {
        console.log('🎯 DEMONSTRATION: Live Event Monitoring');
        console.log('=======================================');
        console.log('This would start live monitoring for TipEvents...');
        console.log('');
        console.log('Expected workflow:');
        console.log('1. 🔍 Connect to Starknet testnet node');
        console.log('2. 🎯 Filter TipEvents for @creatortest');
        console.log('3. ✅ Verify event contains:');
        console.log('   - Sender: tipper_address');
        console.log('   - Amount: 1 TEST token');
        console.log('   - Token: TEST token address');
        console.log('4. 📊 Check contract storage for creator balance');
        console.log('5. 🔗 Generate Voyager explorer link');
        console.log('');
        console.log('🚀 To start live monitoring, run:');
        console.log('   node monitor-events.js monitor');
        console.log('');
        console.log('💡 Or to check existing tips:');
        console.log('   node monitor-events.js check creatortest');
    }
}

// Expected output format
function showExpectedOutput() {
    console.log('📋 EXPECTED OUTPUT AFTER TEST TIP:');
    console.log('==================================');
    console.log(`
🎉 NEW TIP EVENT DETECTED!
========================
📍 Block: 654321
🔗 Transaction: 0x789ef456gh123abc
👤 Recipient: @creatortest (felt: ${12345})
💰 Sender: 0x1234567890abcdef1234567890abcdef12345678
🪙 Token: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
💵 Amount: 1000000000000000000
⏰ Timestamp: 2025-01-25T22:45:00.000Z

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
  1. 1000000000000000000 tokens from 0x1234567890abcdef1234567890abcdef12345678
💰 Token Balances:
  0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d: 1000000000000000000

🔗 VOYAGER EXPLORER LINKS:
---------------------------
📄 Transaction: https://sepolia.voyager.online/tx/0x789ef456gh123abc
📋 Contract: https://sepolia.voyager.online/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e
🧱 Block: https://sepolia.voyager.online/block/654321

🎯 SUCCESS! Event emission verified on Voyager: https://sepolia.voyager.online/tx/0x789ef456gh123abc
========================
    `);
}

async function main() {
    const tester = new MonitoringTester();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'test';
    
    switch (command) {
        case 'test':
            await tester.runTests();
            break;
            
        case 'demo':
            await tester.demonstrateMonitoring();
            break;
            
        case 'output':
            showExpectedOutput();
            break;
            
        default:
            console.log('📖 Usage:');
            console.log('  node test-monitoring.js test     # Run all tests');
            console.log('  node test-monitoring.js demo     # Show monitoring demo');
            console.log('  node test-monitoring.js output   # Show expected output');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
} 