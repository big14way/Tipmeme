# 🚀 Paymaster Service Setup Guide

This guide will help you configure and integrate the TipMeme Paymaster Service for gasless withdrawals.

## 📋 Prerequisites

- Node.js >= 18.0.0
- Starknet account with sufficient funds for gas sponsorship
- Access to Starknet RPC endpoint
- Deployed TipMeme contract on Starknet

## 🔧 Backend Configuration (Paymaster Service)

### 1. Navigate to paymaster service directory
```bash
cd paymaster-service
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the setup script
```bash
chmod +x setup-env.sh
./setup-env.sh
```

### 4. Configure environment variables

Edit the `.env` file with your actual values:

```env
# CRITICAL: Replace with your actual private key
PAYMASTER_PRIVATE_KEY=0x1234567890abcdef...your_actual_private_key_here

# Your deployed contract address (already configured)
TIPMEME_CONTRACT_ADDRESS=0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e

# Gas sponsorship limits (adjust as needed)
MAX_GAS_SPONSORSHIP_PER_TX=0.01       # Max 0.01 ETH per transaction
MAX_DAILY_SPONSORSHIP_PER_IP=0.1      # Max 0.1 ETH per IP per day  
MAX_DAILY_SPONSORSHIP_TOTAL=10        # Max 10 ETH total per day

# Whitelist for testnet (add trusted addresses)
ENABLE_WHITELIST=true
TESTNET_WHITELIST=0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb,0x...add_more_addresses

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000            # 1 minute window
RATE_LIMIT_MAX_REQUESTS=10            # Max 10 requests per minute per IP
```

### 5. Start the paymaster service
```bash
npm start
```

The service will be available at `http://localhost:3001`

### 6. Test the service
```bash
node test-client.js
```

## 🌐 Frontend Configuration

### 1. Add environment variables to your Next.js project

Create/edit `.env.local` in your project root:

```env
# Paymaster Service Configuration
NEXT_PUBLIC_PAYMASTER_URL=http://localhost:3001
NEXT_PUBLIC_PAYMASTER_ENABLED=true

# Starknet Configuration
NEXT_PUBLIC_STARKNET_CHAIN_ID=SN_SEPOLIA
NEXT_PUBLIC_TIPMEME_CONTRACT_ADDRESS=0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e
```

### 2. Use the gasless withdraw component

Add the `GaslessWithdraw` component to your dashboard:

```tsx
import { GaslessWithdraw } from '@/components/dashboard/gasless-withdraw';

// In your dashboard component
<GaslessWithdraw />
```

## 🔑 Private Key Management

### Development
For development, you can use the private key directly in the `.env` file. 

**⚠️ NEVER commit the `.env` file to version control!**

### Production
For production deployments, use secure methods:

#### Option 1: Environment Variables
```bash
export PAYMASTER_PRIVATE_KEY="your_private_key_here"
```

#### Option 2: AWS Secrets Manager
```javascript
// In your config/index.js
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName) => {
  const result = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(result.SecretString);
};
```

#### Option 3: Azure Key Vault
```javascript
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);
```

## 📊 Monitoring & Limits

### Adjust Gas Limits Based on Usage

Monitor your gas usage and adjust limits in `.env`:

```env
# For high-volume applications
MAX_GAS_SPONSORSHIP_PER_TX=0.02       # Increase per-tx limit
MAX_DAILY_SPONSORSHIP_TOTAL=50        # Increase daily total

# For restrictive usage
MAX_GAS_SPONSORSHIP_PER_TX=0.005      # Decrease per-tx limit
MAX_DAILY_SPONSORSHIP_PER_IP=0.05     # Decrease per-IP limit
```

### Monitoring Endpoints

- Health: `GET /health`
- Status: `GET /status`
- Usage Stats: `GET /stats`

```bash
# Check service health
curl http://localhost:3001/health

# Check configuration
curl http://localhost:3001/status

# Check current usage
curl http://localhost:3001/stats
```

## 🛡️ Security Best Practices

### 1. Private Key Security
- Never commit private keys to version control
- Use environment variables or key management services
- Rotate keys regularly
- Use different keys for different environments

### 2. Whitelist Management
```env
# Add only trusted addresses for testnet
TESTNET_WHITELIST=0xaddress1,0xaddress2,0xaddress3
```

### 3. Rate Limiting
```env
# Adjust based on your traffic patterns
RATE_LIMIT_WINDOW_MS=60000     # 1 minute
RATE_LIMIT_MAX_REQUESTS=5      # Conservative limit
```

### 4. CORS Configuration
```env
# Restrict to your domain in production
CORS_ORIGIN=https://yourdomain.com
```

## 🚀 Deployment

### Docker Deployment

1. Build the Docker image:
```bash
cd paymaster-service
docker build -t tipmeme-paymaster .
```

2. Run with environment variables:
```bash
docker run -d \
  -p 3001:3001 \
  -e PAYMASTER_PRIVATE_KEY="your_key_here" \
  -e NODE_ENV=production \
  tipmeme-paymaster
```

### Cloud Deployment

#### Heroku
```bash
heroku create tipmeme-paymaster
heroku config:set PAYMASTER_PRIVATE_KEY="your_key_here"
heroku config:set NODE_ENV=production
git push heroku main
```

#### Vercel/Railway
Set environment variables in your platform's dashboard.

## 🔍 Troubleshooting

### Common Issues

1. **"Paymaster account not configured"**
   - Solution: Set `PAYMASTER_PRIVATE_KEY` in your `.env` file

2. **"Contract address not found"**
   - Solution: Verify `TIPMEME_CONTRACT_ADDRESS` is correct

3. **"Rate limit exceeded"**
   - Solution: Increase rate limits or wait for the window to reset

4. **"Signature verification failed"**
   - Solution: Check that the contract's signature verification is working

### Debug Mode
```env
LOG_LEVEL=debug
NODE_ENV=development
```

### Logs Location
- Main log: `logs/paymaster.log`
- Error log: `logs/error.log`

## 📱 Frontend Integration Examples

### Basic Usage
```tsx
import { paymasterService } from '@/lib/paymaster';

// Check if paymaster is available
const isAvailable = await paymasterService.isAvailable();

// Complete sponsored withdraw
const result = await paymasterService.completeSponsoredWithdraw(
  account,
  'twitter_handle',
  contractAddress
);
```

### With Error Handling
```tsx
try {
  const result = await paymasterService.completeSponsoredWithdraw(
    account,
    handle,
    contractAddress
  );
  
  if (result.success) {
    console.log('Transaction hash:', result.data.txHash);
    console.log('Gas sponsored:', result.data.gasCost, 'ETH');
  } else {
    console.error('Sponsorship failed:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## 📈 Usage Statistics

Monitor your paymaster usage:

```bash
# Get current usage stats
curl http://localhost:3001/stats

# Response example:
{
  "success": true,
  "data": {
    "ip": {
      "usage": 0.05,
      "limit": 0.1,
      "remaining": 0.05
    },
    "total": {
      "usage": 2.3,
      "limit": 10,
      "remaining": 7.7
    },
    "resetTime": "2024-01-16T00:00:00.000Z"
  }
}
```

## 🎯 Next Steps

1. **Configure your private key** in the paymaster service
2. **Add frontend environment variables**
3. **Test the integration** with small amounts
4. **Monitor gas usage** and adjust limits
5. **Set up monitoring** for production
6. **Implement proper key management** for production

---

## 🆘 Support

If you encounter issues:

1. Check the logs: `tail -f paymaster-service/logs/paymaster.log`
2. Verify your configuration with the setup script
3. Test with the provided test client
4. Ensure your Starknet account has sufficient funds

Happy building! 🚀 