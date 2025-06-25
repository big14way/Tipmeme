# TipMeme Paymaster Service

A Node.js service that sponsors gas fees for `withdraw()` calls on the TipMeme Starknet smart contract. This service implements EIP-712 signature verification, rate limiting, and comprehensive logging.

## Features

- ✅ **Gas Sponsorship**: Sponsors gas fees for verified withdraw() calls
- ✅ **EIP-712 Signature Verification**: Ensures withdraw requests are properly signed
- ✅ **Rate Limiting**: IP-based rate limiting with configurable limits
- ✅ **Starknet.js Integration**: Uses Starknet.js for fee estimation and transaction execution
- ✅ **Whitelist Support**: Configurable testnet whitelist for controlled access
- ✅ **Comprehensive Logging**: Winston-based logging with error tracking
- ✅ **Health Monitoring**: Health check endpoints for monitoring
- ✅ **Security**: Helmet, CORS, input validation, and sanitization

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Starknet account with sufficient funds for gas sponsorship
- Access to Starknet RPC endpoint

### Installation

```bash
cd paymaster-service
npm install
```

### Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Edit `.env` with your configuration:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Starknet Configuration
STARKNET_PROVIDER_URL=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
STARKNET_CHAIN_ID=SN_SEPOLIA
TIPMEME_CONTRACT_ADDRESS=0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e

# Paymaster Account (REQUIRED)
PAYMASTER_PRIVATE_KEY=your_private_key_here
PAYMASTER_ADDRESS=0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Gas Sponsorship Limits
MAX_GAS_SPONSORSHIP_PER_TX=0.01
MAX_DAILY_SPONSORSHIP_PER_IP=0.1
MAX_DAILY_SPONSORSHIP_TOTAL=10

# Whitelist (Optional)
TESTNET_WHITELIST=0x123...,0x456...
ENABLE_WHITELIST=true
```

### Running the Service

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/sponsor

Sponsors gas for a withdraw() call.

**Request Body:**
```json
{
  "userAddress": "0x123...",
  "handle": "twitter_handle",
  "nonce": "123",
  "signature": ["0xabc...", "0xdef..."]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0x789...",
    "gasCost": 0.005,
    "gasEstimate": {
      "amount": "50000",
      "fee": "5000000000000000",
      "price": "100000000000"
    },
    "processingTime": 2500,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/sponsor/estimate

Estimates gas cost without executing the transaction.

**Query Parameters:**
- `userAddress`: User's Starknet address
- `handle`: Twitter handle
- `signature`: Signature array

### GET /api/sponsor/nonce/:address

Gets the current nonce for a user address.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x123...",
    "nonce": "5",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /health

Health check endpoint.

### GET /status

Detailed service status and configuration.

### GET /stats

Sponsorship usage statistics for the current IP.

## Rate Limiting

The service implements multiple layers of rate limiting:

1. **Request Rate Limiting**: 10 requests per minute per IP (configurable)
2. **Sponsorship Rate Limiting**: 
   - Maximum 0.01 ETH per transaction
   - Maximum 0.1 ETH per day per IP
   - Maximum 10 ETH per day total

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Joi-based request validation
- **Input Sanitization**: XSS protection
- **Rate Limiting**: Multiple layers of rate limiting
- **Whitelist**: Optional address whitelist for testnet
- **Logging**: Comprehensive security event logging

## Error Handling

The service returns structured error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details"
}
```

### Error Codes

- `INVALID_SIGNATURE`: Signature verification failed
- `GAS_ESTIMATION_FAILED`: Unable to estimate gas
- `GAS_COST_TOO_HIGH`: Gas cost exceeds maximum
- `TRANSACTION_FAILED`: Transaction execution failed
- `RATE_LIMIT_EXCEEDED`: Rate limit reached
- `WHITELIST_VIOLATION`: Address not whitelisted
- `VALIDATION_FAILED`: Request validation failed

## Logging

The service uses Winston for comprehensive logging:

- **File Logging**: Logs to `logs/paymaster.log`
- **Error Logging**: Separate error log file
- **Console Logging**: Development mode only
- **Structured Logging**: JSON format for easy parsing

### Log Levels

- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `debug`: Debug messages

## Monitoring

### Health Checks

```bash
curl http://localhost:3001/health
```

### Metrics

The service tracks:
- Transaction success/failure rates
- Gas costs and estimates
- Rate limiting violations
- Security events
- Response times

## Development

### Project Structure

```
paymaster-service/
├── src/
│   ├── config/           # Configuration management
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (logging, Starknet)
│   └── server.js        # Main server file
├── logs/                # Log files
├── package.json
├── env.example
└── README.md
```

### Testing

```bash
# Run tests
npm test

# Test with curl
curl -X POST http://localhost:3001/api/sponsor \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x123...",
    "handle": "test_handle",
    "nonce": "1",
    "signature": ["0xabc...", "0xdef..."]
  }'
```

## Deployment

### Environment Variables

Ensure all required environment variables are set:
- `PAYMASTER_PRIVATE_KEY`: **REQUIRED** - Private key for gas sponsorship
- `STARKNET_PROVIDER_URL`: Starknet RPC endpoint
- `TIPMEME_CONTRACT_ADDRESS`: TipMeme contract address

### Production Considerations

1. **Security**: Use proper private key management (Azure Key Vault, AWS Secrets Manager, etc.)
2. **Monitoring**: Set up monitoring for health endpoints
3. **Logging**: Configure log aggregation (ELK stack, Splunk, etc.)
4. **Rate Limiting**: Adjust limits based on usage patterns
5. **Gas Limits**: Monitor and adjust gas sponsorship limits
6. **High Availability**: Run multiple instances behind a load balancer

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ src/
EXPOSE 3001
CMD ["npm", "start"]
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Link to your repo]
- Documentation: [Link to docs]
- Discord: [Link to community] 