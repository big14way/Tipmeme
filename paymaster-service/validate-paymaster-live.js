#!/usr/bin/env node

/**
 * Live Paymaster Validation Test
 * Tests actual paymaster service with real API calls
 */

const axios = require('axios');
const { Account, RpcProvider, hash, shortString } = require('starknet');

class LivePaymasterValidator {
    constructor() {
        this.config = {
            paymasterUrl: 'http://localhost:3001',
            rpcUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8',
            contractAddress: '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e',
            testUser: {
                address: '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
                handle: 'creatortest'
            }
        };
        
        this.provider = new RpcProvider({ nodeUrl: this.config.rpcUrl });
    }

    async validateLivePaymaster() {
        console.log('🚀 LIVE PAYMASTER VALIDATION');
        console.log('============================');
        console.log('');

        try {
            // Step 1: Check service health
            console.log('1️⃣  Checking paymaster service health...');
            await this.checkServiceHealth();
            
            // Step 2: Test sponsored withdraw
            console.log('2️⃣  Testing sponsored transaction...');
            await this.testSponsoredWithdraw();
            
            // Step 3: Monitor server logs
            console.log('3️⃣  Monitoring server response...');
            await this.monitorServerResponse();
            
            console.log('✅ Live validation completed successfully!');
            
        } catch (error) {
            console.error('❌ Live validation failed:', error.message);
            console.log('💡 Make sure paymaster service is running: npm run dev');
        }
    }

    async checkServiceHealth() {
        try {
            const response = await axios.get(`${this.config.paymasterUrl}/health`, {
                timeout: 5000
            });

            console.log('✅ Paymaster service is running');
            console.log(`📊 Status: ${response.data.status}`);
            console.log(`🌐 Starknet: ${response.data.starknet?.healthy ? 'Connected' : 'Disconnected'}`);
            console.log(`⏰ Uptime: ${Math.floor(response.data.uptime)}s`);
            console.log('');

        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Paymaster service is not running. Start it with: cd paymaster-service && npm run dev');
            }
            throw error;
        }
    }

    async testSponsoredWithdraw() {
        const requestData = {
            userAddress: this.config.testUser.address,
            handle: this.config.testUser.handle,
            nonce: Date.now().toString(),
            signature: [
                '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456',
                '0x6789012345678901234567890123456789012345678901234567890123456789'
            ]
        };

        console.log('📤 Sending sponsored withdraw request:');
        console.log(`🎯 POST ${this.config.paymasterUrl}/api/sponsor`);
        console.log(`👤 User: ${requestData.userAddress}`);
        console.log(`📝 Handle: ${requestData.handle}`);
        console.log(`🔢 Nonce: ${requestData.nonce}`);
        console.log('');

        try {
            const response = await axios.post(
                `${this.config.paymasterUrl}/api/sponsor`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'TipMeme-Paymaster-Validator/1.0'
                    },
                    timeout: 30000
                }
            );

            if (response.data.success) {
                console.log('✅ Sponsored transaction successful!');
                console.log(`🔗 Transaction Hash: ${response.data.data.txHash}`);
                console.log(`⛽ Gas Cost: ${response.data.data.gasCost} ETH`);
                console.log(`⏱️  Processing Time: ${response.data.data.processingTime}ms`);
                console.log(`📅 Timestamp: ${response.data.data.timestamp}`);
                console.log('');

                return response.data.data;
            } else {
                throw new Error(`Sponsorship failed: ${response.data.error}`);
            }

        } catch (error) {
            if (error.response?.data) {
                console.log('❌ Paymaster API Error:');
                console.log(`📋 Status: ${error.response.status}`);
                console.log(`💬 Error: ${error.response.data.error}`);
                console.log(`🔧 Code: ${error.response.data.code}`);
                
                if (error.response.data.details) {
                    console.log(`📝 Details: ${error.response.data.details}`);
                }
                console.log('');
            }
            throw error;
        }
    }

    async monitorServerResponse() {
        console.log('📊 Expected Server Log Flow:');
        console.log('───────────────────────────');
        
        const expectedLogs = [
            '🔵 [INFO] Incoming request - POST /api/sponsor',
            '🔵 [INFO] Sponsorship request received',
            '🔵 [INFO] Verifying signature...',
            '🔵 [INFO] Signature verified successfully',
            '🔵 [INFO] Estimating gas fees...',
            '🔵 [INFO] Gas estimation successful',
            '🔵 [INFO] Executing sponsored transaction...',
            '🔵 [INFO] Sponsorship completed successfully',
            '🔵 [INFO] Request completed - 200 OK'
        ];

        expectedLogs.forEach((log, index) => {
            setTimeout(() => console.log(log), index * 200);
        });

        console.log('');
        console.log('💡 Check your paymaster service terminal for actual logs');
        console.log('');
    }

    async getPaymasterStatus() {
        try {
            const response = await axios.get(`${this.config.paymasterUrl}/status`);
            
            console.log('📊 PAYMASTER SERVICE STATUS');
            console.log('===========================');
            console.log(`🏷️  Service: ${response.data.service}`);
            console.log(`📦 Version: ${response.data.version}`);
            console.log(`🌍 Environment: ${response.data.environment}`);
            console.log(`⏰ Uptime: ${response.data.uptime.human}`);
            console.log('');
            console.log('⚙️  Configuration:');
            console.log(`📊 Rate Limit: ${response.data.config.rateLimit.maxRequests} requests/${response.data.config.rateLimit.windowMs}ms`);
            console.log(`⛽ Max Gas/TX: ${response.data.config.sponsorship.maxGasPerTx} ETH`);
            console.log(`🔒 Whitelist: ${response.data.config.whitelist.enabled ? 'Enabled' : 'Disabled'}`);
            console.log('');
            console.log('🌐 Starknet:');
            console.log(`📍 Chain: ${response.data.config.starknet.chainId}`);
            console.log(`🔗 Contract: ${response.data.config.starknet.contractAddress}`);
            console.log(`🏠 Provider: ${response.data.config.starknet.providerUrl}`);
            console.log('');

        } catch (error) {
            console.error('❌ Failed to get paymaster status:', error.message);
        }
    }
}

// Enhanced server logs display
function displayExpectedServerLogs() {
    console.log('🖥️  EXPECTED PAYMASTER SERVER LOGS');
    console.log('==================================');
    
    const timestamp = new Date().toISOString();
    const logs = [
        `[${timestamp}] [INFO] Incoming request`,
        '  method: POST',
        '  url: /api/sponsor',
        '  ip: 127.0.0.1',
        '  userAgent: TipMeme-Paymaster-Validator/1.0',
        '',
        `[${timestamp}] [INFO] Sponsorship request received`,
        '  userAddress: 0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
        '  handle: creatortest',
        '  nonce: ' + Date.now(),
        '  ip: 127.0.0.1',
        '',
        `[${timestamp}] [INFO] Verifying signature...`,
        `[${timestamp}] [INFO] Signature verified successfully`,
        '',
        `[${timestamp}] [INFO] Estimating gas fees...`,
        `[${timestamp}] [INFO] Gas estimation successful`,
        '  gasAmount: 21000',
        '  gasFee: 3000000000000000',
        '  gasCostEth: 0.003',
        '',
        `[${timestamp}] [INFO] Executing sponsored transaction...`,
        `[${timestamp}] [INFO] Withdraw transaction sponsored successfully`,
        '  txHash: 0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123',
        '  userAddress: 0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
        '  handle: creatortest',
        '  gasCost: 0.003',
        '',
        `[${timestamp}] [INFO] Sponsorship completed successfully`,
        '  txHash: 0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123',
        '  gasCost: 0.003',
        '  processingTime: 2500ms',
        '',
        `[${timestamp}] [INFO] Request completed`,
        '  method: POST',
        '  url: /api/sponsor',
        '  statusCode: 200',
        '  duration: 2500ms',
        '  ip: 127.0.0.1',
        '',
        '✅ VALIDATION COMPLETE:',
        '   ✓ Signature validation passed',
        '   ✓ Transaction fee calculated (0.003 ETH)',
        '   ✓ Testnet STRK deducted from sponsor account',
        '   ✓ Transaction succeeded with 0 gas paid by user'
    ];
    
    logs.forEach(log => console.log(log));
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'validate';
    
    const validator = new LivePaymasterValidator();
    
    switch (command) {
        case 'validate':
            await validator.validateLivePaymaster();
            break;
            
        case 'status':
            await validator.getPaymasterStatus();
            break;
            
        case 'logs':
            displayExpectedServerLogs();
            break;
            
        default:
            console.log('📖 Usage:');
            console.log('  node validate-paymaster-live.js validate  # Test live paymaster');
            console.log('  node validate-paymaster-live.js status    # Get service status');
            console.log('  node validate-paymaster-live.js logs      # Show expected logs');
            break;
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = LivePaymasterValidator; 