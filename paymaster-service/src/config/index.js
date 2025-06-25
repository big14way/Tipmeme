require('dotenv').config();

const config = {
  server: {
    port: parseInt(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  starknet: {
    providerUrl: process.env.STARKNET_PROVIDER_URL || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
    chainId: process.env.STARKNET_CHAIN_ID || 'SN_SEPOLIA',
    contractAddress: process.env.TIPMEME_CONTRACT_ADDRESS || '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e',
  },
  
  paymaster: {
    privateKey: process.env.PAYMASTER_PRIVATE_KEY,
    address: process.env.PAYMASTER_ADDRESS || '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  },
  
  sponsorship: {
    maxGasPerTx: parseFloat(process.env.MAX_GAS_SPONSORSHIP_PER_TX) || 0.01, // ETH
    maxDailyPerIp: parseFloat(process.env.MAX_DAILY_SPONSORSHIP_PER_IP) || 0.1, // ETH
    maxDailyTotal: parseFloat(process.env.MAX_DAILY_SPONSORSHIP_TOTAL) || 10, // ETH
  },
  
  whitelist: {
    enabled: process.env.ENABLE_WHITELIST === 'true',
    addresses: process.env.TESTNET_WHITELIST ? 
      process.env.TESTNET_WHITELIST.split(',').map(addr => addr.trim()) : 
      [],
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/paymaster.log',
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  },
  
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
  },
};

// Validation
if (!config.paymaster.privateKey && config.server.nodeEnv === 'production') {
  throw new Error('PAYMASTER_PRIVATE_KEY is required in production');
}

module.exports = config; 