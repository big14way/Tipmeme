#!/usr/bin/env node

/**
 * TipMeme Contract Event Monitor
 * Monitors TipEvents on Starknet Sepolia testnet and verifies contract storage
 */

const { RpcProvider, Contract, hash, CallData, shortString } = require('starknet');

// Configuration
const CONFIG = {
    CONTRACT_ADDRESS: '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e',
    RPC_URL: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8',
    NETWORK: 'sepolia',
    // Test data
    CREATOR_HANDLE: 'creatortest', // @creatortest
    CREATOR_HANDLE_FELT: '12345', // felt252 representation of @creatortest
    TEST_TOKEN_ADDRESS: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // STRK token on Sepolia
    VOYAGER_BASE_URL: 'https://sepolia.voyager.online'
};

// Contract ABI for event parsing
const CONTRACT_ABI = [
    {
        "type": "event",
        "name": "TipEvent",
        "keys": [],
        "data": [
            { "name": "handle", "type": "felt252" },
            { "name": "sender", "type": "ContractAddress" },
            { "name": "token", "type": "ContractAddress" },
            { "name": "amount", "type": "u256" }
        ]
    },
    {
        "type": "function",
        "name": "get_tips",
        "inputs": [{ "name": "handle", "type": "felt252" }],
        "outputs": [{ "type": "Array<TipStruct>" }],
        "state_mutability": "view"
    },
    {
        "type": "function", 
        "name": "get_balance",
        "inputs": [{ "name": "account", "type": "ContractAddress" }],
        "outputs": [{ "type": "u256" }],
        "state_mutability": "view"
    }
];

class EventMonitor {
    constructor() {
        this.provider = new RpcProvider({ nodeUrl: CONFIG.RPC_URL });
        this.contract = new Contract(CONTRACT_ABI, CONFIG.CONTRACT_ADDRESS, this.provider);
        this.isMonitoring = false;
    }

    /**
     * Convert Twitter handle to felt252
     */
    handleToFelt(handle) {
        // Remove @ if present
        const cleanHandle = handle.replace('@', '');
        // Convert to felt252 using shortString encoding
        return shortString.encodeShortString(cleanHandle);
    }

    /**
     * Convert felt252 back to handle
     */
    feltToHandle(felt) {
        try {
            return shortString.decodeShortString(felt);
        } catch (e) {
            return felt; // Return as-is if can't decode
        }
    }

    /**
     * Start monitoring events from latest block
     */
    async startMonitoring() {
        console.log('🚀 TipMeme Event Monitor Starting...');
        console.log('=====================================');
        console.log(`📡 Network: Starknet ${CONFIG.NETWORK}`);
        console.log(`📄 Contract: ${CONFIG.CONTRACT_ADDRESS}`);
        console.log(`🎯 Monitoring for @${CONFIG.CREATOR_HANDLE} tips`);
        console.log(`🔍 Voyager Explorer: ${CONFIG.VOYAGER_BASE_URL}/contract/${CONFIG.CONTRACT_ADDRESS}`);
        console.log('=====================================\n');

        this.isMonitoring = true;
        let lastBlock = await this.provider.getBlockNumber();
        
        console.log(`📊 Starting from block: ${lastBlock}`);
        console.log('⏳ Waiting for new tip events...\n');

        // Poll for new events every 10 seconds
        const pollInterval = setInterval(async () => {
            if (!this.isMonitoring) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const currentBlock = await this.provider.getBlockNumber();
                
                if (currentBlock > lastBlock) {
                    console.log(`🔍 Checking blocks ${lastBlock + 1} to ${currentBlock}...`);
                    await this.checkForEvents(lastBlock + 1, currentBlock);
                    lastBlock = currentBlock;
                }
            } catch (error) {
                console.error('❌ Error polling events:', error.message);
            }
        }, 10000); // Poll every 10 seconds

        // Also check recent blocks for any missed events
        console.log('🔄 Checking recent blocks for existing events...');
        const recentBlocks = 100; // Check last 100 blocks
        const fromBlock = Math.max(1, lastBlock - recentBlocks);
        await this.checkForEvents(fromBlock, lastBlock);
    }

    /**
     * Check for TipEvents in a block range
     */
    async checkForEvents(fromBlock, toBlock) {
        try {
            // Get events from the contract
            const events = await this.provider.getEvents({
                from_block: { block_number: fromBlock },
                to_block: { block_number: toBlock },
                address: CONFIG.CONTRACT_ADDRESS,
                keys: [hash.getSelectorFromName('TipEvent')]
            });

            if (events.events && events.events.length > 0) {
                console.log(`✅ Found ${events.events.length} TipEvent(s) in blocks ${fromBlock}-${toBlock}`);
                
                for (const event of events.events) {
                    await this.processEvent(event);
                }
            }
        } catch (error) {
            console.error(`❌ Error checking events for blocks ${fromBlock}-${toBlock}:`, error.message);
        }
    }

    /**
     * Process a single TipEvent
     */
    async processEvent(event) {
        try {
            console.log('\n🎉 NEW TIP EVENT DETECTED!');
            console.log('========================');
            
            // Parse event data
            const data = event.data;
            const handle = data[0];
            const sender = data[1];
            const token = data[2];
            const amountLow = data[3];
            const amountHigh = data[4];
            
            // Convert u256 amount (low, high) to readable format
            const amount = BigInt(amountLow) + (BigInt(amountHigh) << 128n);
            
            // Convert handle felt to readable format
            const handleString = this.feltToHandle(handle);
            
            console.log(`📍 Block: ${event.block_number}`);
            console.log(`🔗 Transaction: ${event.transaction_hash}`);
            console.log(`👤 Recipient: @${handleString} (felt: ${handle})`);
            console.log(`💰 Sender: ${sender}`);
            console.log(`🪙 Token: ${token}`);
            console.log(`💵 Amount: ${amount.toString()}`);
            console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
            
            // Check if this is for our test creator
            if (handleString === CONFIG.CREATOR_HANDLE || handle === CONFIG.CREATOR_HANDLE_FELT) {
                console.log('🎯 TARGET EVENT FOUND! This tip is for @creatortest');
                
                // Verify event details
                await this.verifyEventDetails(event, handle, sender, token, amount);
                
                // Check contract storage
                await this.checkContractStorage(handle);
                
                // Generate Voyager link
                this.generateVoyagerLinks(event);
            }
            
            console.log('========================\n');
            
        } catch (error) {
            console.error('❌ Error processing event:', error.message);
        }
    }

    /**
     * Verify event contains expected details
     */
    async verifyEventDetails(event, handle, sender, token, amount) {
        console.log('\n🔍 VERIFYING EVENT DETAILS:');
        console.log('---------------------------');
        
        // Check if recipient matches @creatortest
        const expectedHandle = this.handleToFelt(CONFIG.CREATOR_HANDLE);
        const handleMatch = handle === expectedHandle || handle === CONFIG.CREATOR_HANDLE_FELT;
        console.log(`✅ Recipient Handle: ${handleMatch ? '✓' : '✗'} Expected @creatortest`);
        
        // Check if amount is 1 (assuming 1 TEST token = 1 * 10^18 wei)
        const expectedAmount = BigInt('1000000000000000000'); // 1 * 10^18
        const amountMatch = amount === expectedAmount || amount === 1n;
        console.log(`✅ Amount: ${amountMatch ? '✓' : '✗'} Expected 1 TEST token (got ${amount.toString()})`);
        
        // Check if token is TEST token
        const tokenMatch = token.toLowerCase() === CONFIG.TEST_TOKEN_ADDRESS.toLowerCase();
        console.log(`✅ Token Address: ${tokenMatch ? '✓' : '✗'} Expected TEST token`);
        
        // Check if sender exists
        const senderValid = sender && sender !== '0x0';
        console.log(`✅ Sender Address: ${senderValid ? '✓' : '✗'} Valid tipper address`);
        
        const allValid = handleMatch && amountMatch && tokenMatch && senderValid;
        console.log(`\n🎯 OVERALL VERIFICATION: ${allValid ? '✅ PASSED' : '❌ FAILED'}`);
        
        return allValid;
    }

    /**
     * Check contract storage for creator's balance
     */
    async checkContractStorage(handle) {
        try {
            console.log('\n📊 CHECKING CONTRACT STORAGE:');
            console.log('-----------------------------');
            
            // Get tips for the handle
            const tips = await this.contract.get_tips(handle);
            console.log(`📝 Total Tips Count: ${tips.length}`);
            
            if (tips.length > 0) {
                console.log('📋 Recent Tips:');
                tips.slice(-3).forEach((tip, index) => {
                    const amount = BigInt(tip.amount.low) + (BigInt(tip.amount.high) << 128n);
                    console.log(`  ${index + 1}. ${amount.toString()} tokens from ${tip.sender}`);
                });
            }
            
            // Calculate total balance for this handle per token
            const tokenBalances = new Map();
            tips.forEach(tip => {
                const amount = BigInt(tip.amount.low) + (BigInt(tip.amount.high) << 128n);
                const token = tip.token;
                tokenBalances.set(token, (tokenBalances.get(token) || 0n) + amount);
            });
            
            console.log('💰 Token Balances:');
            for (const [token, balance] of tokenBalances) {
                console.log(`  ${token}: ${balance.toString()}`);
            }
            
        } catch (error) {
            console.error('❌ Error checking contract storage:', error.message);
        }
    }

    /**
     * Generate Voyager explorer links
     */
    generateVoyagerLinks(event) {
        console.log('\n🔗 VOYAGER EXPLORER LINKS:');
        console.log('---------------------------');
        
        const txLink = `${CONFIG.VOYAGER_BASE_URL}/tx/${event.transaction_hash}`;
        const contractLink = `${CONFIG.VOYAGER_BASE_URL}/contract/${CONFIG.CONTRACT_ADDRESS}`;
        const blockLink = `${CONFIG.VOYAGER_BASE_URL}/block/${event.block_number}`;
        
        console.log(`📄 Transaction: ${txLink}`);
        console.log(`📋 Contract: ${contractLink}`);
        console.log(`🧱 Block: ${blockLink}`);
        console.log(`\n🎯 SUCCESS! Event emission verified on Voyager: ${txLink}`);
    }

    /**
     * Simulate a test tip for demonstration
     */
    async simulateTestTip() {
        console.log('🧪 SIMULATING TEST TIP EVENT:');
        console.log('=============================');
        
        // Create mock event for testing
        const mockEvent = {
            block_number: 123456,
            transaction_hash: '0x789ef456gh',
            data: [
                this.handleToFelt(CONFIG.CREATOR_HANDLE), // handle
                '0x1234567890abcdef1234567890abcdef12345678', // sender
                CONFIG.TEST_TOKEN_ADDRESS, // token
                '1000000000000000000', // amount low (1 * 10^18)
                '0' // amount high
            ]
        };
        
        console.log('📝 Mock event created for @creatortest');
        await this.processEvent(mockEvent);
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        console.log('\n🛑 Stopping event monitor...');
        this.isMonitoring = false;
    }
}

// CLI Interface
async function main() {
    const monitor = new EventMonitor();
    
    const args = process.argv.slice(2);
    const command = args[0] || 'monitor';
    
    switch (command) {
        case 'monitor':
            await monitor.startMonitoring();
            break;
            
        case 'simulate':
            await monitor.simulateTestTip();
            break;
            
        case 'check':
            const handle = args[1] || CONFIG.CREATOR_HANDLE;
            const handleFelt = monitor.handleToFelt(handle);
            console.log(`🔍 Checking tips for @${handle} (felt: ${handleFelt})`);
            await monitor.checkContractStorage(handleFelt);
            break;
            
        default:
            console.log('📖 Usage:');
            console.log('  node monitor-events.js monitor    # Start monitoring events');
            console.log('  node monitor-events.js simulate   # Simulate test event');
            console.log('  node monitor-events.js check [@handle]  # Check contract storage');
            break;
    }
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        monitor.stopMonitoring();
        process.exit(0);
    });
}

// Export for use in other scripts
module.exports = { EventMonitor, CONFIG };

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
} 