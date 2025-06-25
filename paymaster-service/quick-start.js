#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function quickStart() {
  console.log('🚀 TipMeme Paymaster Service Quick Start');
  console.log('=====================================\n');

  try {
    // Check if .env already exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    // Get configuration from user
    console.log('Please provide the following configuration:\n');

    const privateKey = await question('🔑 Paymaster Private Key (REQUIRED): ');
    if (!privateKey || privateKey === 'your_private_key_here') {
      console.log('❌ Private key is required. Exiting...');
      rl.close();
      return;
    }

    const paymasterAddress = await question('📍 Paymaster Address (press Enter for default): ') || 
      '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb';

    const maxGasPerTx = await question('⛽ Max gas per transaction in ETH (default: 0.01): ') || '0.01';
    const maxDailyPerIp = await question('📊 Max daily sponsorship per IP in ETH (default: 0.1): ') || '0.1';
    const maxDailyTotal = await question('🌍 Max daily total sponsorship in ETH (default: 10): ') || '10';

    const enableWhitelist = await question('🛡️  Enable whitelist? (y/n, default: y): ');
    const whitelistEnabled = enableWhitelist.toLowerCase() !== 'n';

    let whitelistAddresses = '';
    if (whitelistEnabled) {
      whitelistAddresses = await question('📝 Whitelist addresses (comma-separated, press Enter for default): ') ||
        '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb,0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e';
    }

    const port = await question('🌐 Server port (default: 3001): ') || '3001';
    const corsOrigin = await question('🔗 CORS origin (default: http://localhost:3000): ') || 'http://localhost:3000';

    // Create .env content
    const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# Starknet Configuration
STARKNET_PROVIDER_URL=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
STARKNET_CHAIN_ID=SN_SEPOLIA
TIPMEME_CONTRACT_ADDRESS=0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e

# Paymaster Account
PAYMASTER_PRIVATE_KEY=${privateKey}
PAYMASTER_ADDRESS=${paymasterAddress}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Gas Sponsorship Limits
MAX_GAS_SPONSORSHIP_PER_TX=${maxGasPerTx}
MAX_DAILY_SPONSORSHIP_PER_IP=${maxDailyPerIp}
MAX_DAILY_SPONSORSHIP_TOTAL=${maxDailyTotal}

# Whitelist Configuration
TESTNET_WHITELIST=${whitelistAddresses}
ENABLE_WHITELIST=${whitelistEnabled}

# Logging
LOG_LEVEL=info
LOG_FILE=logs/paymaster.log

# Security
JWT_SECRET=${generateRandomSecret()}
CORS_ORIGIN=${corsOrigin}

# Cache TTL (in seconds)
CACHE_TTL=300
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');

    // Create logs directory
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
      console.log('✅ Logs directory created');
    }

    // Check if dependencies are installed
    const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
    if (!nodeModulesExists) {
      console.log('\n📦 Installing dependencies...');
      const { spawn } = require('child_process');
      
      const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
      npmInstall.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed successfully!');
          showNextSteps();
        } else {
          console.log('❌ Failed to install dependencies. Please run: npm install');
        }
        rl.close();
      });
    } else {
      showNextSteps();
      rl.close();
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
  }
}

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

function showNextSteps() {
  console.log('\n🎉 Setup Complete!');
  console.log('=================');
  console.log('');
  console.log('Next steps:');
  console.log('1. Start the service: npm start');
  console.log('2. Test the service: node test-client.js');
  console.log('3. Check health: curl http://localhost:3001/health');
  console.log('4. View documentation: see PAYMASTER_SETUP.md');
  console.log('');
  console.log('🔐 Security reminders:');
  console.log('• Never commit .env file to version control');
  console.log('• Monitor gas usage regularly');
  console.log('• Use proper key management in production');
  console.log('');
  console.log('📊 Monitor your service:');
  console.log('• Health: http://localhost:3001/health');
  console.log('• Status: http://localhost:3001/status');
  console.log('• Usage stats: http://localhost:3001/stats');
}

if (require.main === module) {
  quickStart().catch(console.error);
}

module.exports = { quickStart }; 