#!/bin/bash

echo "🔧 Setting up TipMeme Paymaster Service Environment"
echo "=================================================="
echo

# Copy template if .env doesn't exist
if [ ! -f .env ]; then
    echo "📄 Copying environment template..."
    cp env.example .env
    echo "✅ Created .env file"
else
    echo "⚠️  .env file already exists"
fi

echo
echo "🔑 IMPORTANT CONFIGURATION REQUIRED:"
echo "====================================="
echo
echo "1. PAYMASTER_PRIVATE_KEY (REQUIRED)"
echo "   This is the private key of the account that will pay for gas"
echo "   Current value: $(grep PAYMASTER_PRIVATE_KEY .env | cut -d'=' -f2)"
echo "   ⚠️  NEVER commit this key to version control!"
echo

echo "2. TIPMEME_CONTRACT_ADDRESS (CONFIGURED)"
echo "   Your deployed TipMeme contract address"
echo "   Current value: $(grep TIPMEME_CONTRACT_ADDRESS .env | cut -d'=' -f2)"
echo

echo "3. GAS SPONSORSHIP LIMITS"
echo "   MAX_GAS_SPONSORSHIP_PER_TX: $(grep MAX_GAS_SPONSORSHIP_PER_TX .env | cut -d'=' -f2) ETH per transaction"
echo "   MAX_DAILY_SPONSORSHIP_PER_IP: $(grep MAX_DAILY_SPONSORSHIP_PER_IP .env | cut -d'=' -f2) ETH per IP per day"
echo "   MAX_DAILY_SPONSORSHIP_TOTAL: $(grep MAX_DAILY_SPONSORSHIP_TOTAL .env | cut -d'=' -f2) ETH total per day"
echo

echo "4. WHITELIST CONFIGURATION"
echo "   ENABLE_WHITELIST: $(grep ENABLE_WHITELIST .env | cut -d'=' -f2)"
echo "   TESTNET_WHITELIST: $(grep TESTNET_WHITELIST .env | cut -d'=' -f2)"
echo

echo "📝 TO COMPLETE SETUP:"
echo "===================="
echo "1. Edit .env file with your actual private key:"
echo "   nano .env"
echo
echo "2. Replace 'YOUR_ACTUAL_PRIVATE_KEY_HERE' with your real private key"
echo
echo "3. Adjust gas limits if needed for your use case"
echo
echo "4. Add addresses to TESTNET_WHITELIST (comma-separated)"
echo
echo "5. Start the service:"
echo "   npm start"
echo

# Check if private key is set
if grep -q "YOUR_ACTUAL_PRIVATE_KEY_HERE" .env; then
    echo "❌ WARNING: Private key not configured!"
    echo "   The service will not work until you set PAYMASTER_PRIVATE_KEY"
else
    echo "✅ Private key appears to be configured"
fi

echo
echo "🔐 SECURITY REMINDERS:"
echo "====================="
echo "• Never commit .env file to git"
echo "• Use environment variables in production"
echo "• Consider using key management services (AWS Secrets Manager, etc.)"
echo "• Monitor gas usage and adjust limits as needed"
echo "• Regularly rotate private keys"
echo

echo "🚀 Ready to start? Run: npm start" 