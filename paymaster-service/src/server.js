const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const config = require('./config');
const { logger } = require('./utils/logger');
const { createRateLimit, getSponsorshipStats } = require('./middleware/rateLimit');
const starknetService = require('./utils/starknet');

// Import routes
const sponsorRoutes = require('./routes/sponsor');

// Create Express app
const app = express();

// Trust proxy for accurate IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
app.use(createRateLimit());

// Body parsing middleware
app.use(express.json({ 
  limit: '10kb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: false,
  limit: '10kb'
}));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });

  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  };

  // Check Starknet connection
  try {
    const starknetHealth = await starknetService.healthCheck();
    healthData.starknet = starknetHealth;
  } catch (error) {
    healthData.starknet = { 
      healthy: false, 
      error: error.message 
    };
    healthData.status = 'degraded';
  }

  const statusCode = healthData.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Status endpoint with more detailed information
app.get('/status', async (req, res) => {
  try {
    const status = {
      service: 'TipMeme Paymaster Service',
      version: '1.0.0',
      environment: config.server.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(process.uptime()),
        human: formatUptime(process.uptime())
      },
      config: {
        rateLimit: {
          windowMs: config.rateLimit.windowMs,
          maxRequests: config.rateLimit.maxRequests
        },
        sponsorship: {
          maxGasPerTx: config.sponsorship.maxGasPerTx,
          maxDailyPerIp: config.sponsorship.maxDailyPerIp,
          maxDailyTotal: config.sponsorship.maxDailyTotal
        },
        whitelist: {
          enabled: config.whitelist.enabled,
          addressCount: config.whitelist.addresses.length
        },
        starknet: {
          chainId: config.starknet.chainId,
          contractAddress: config.starknet.contractAddress,
          providerUrl: config.starknet.providerUrl
        }
      }
    };

    // Add Starknet health check
    const starknetHealth = await starknetService.healthCheck();
    status.starknet = starknetHealth;

    res.json(status);
  } catch (error) {
    logger.error('Error in status endpoint', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to get service status'
    });
  }
});

// Sponsorship statistics endpoint
app.get('/stats', getSponsorshipStats);

// API routes
app.use('/api', sponsorRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'TipMeme Paymaster Service',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      sponsor: 'POST /api/sponsor',
      estimate: 'GET /api/sponsor/estimate',
      nonce: 'GET /api/sponsor/nonce/:address',
      health: 'GET /health',
      status: 'GET /status',
      stats: 'GET /stats'
    },
    documentation: 'https://github.com/your-org/tipmeme-paymaster#api-documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 - Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body
  });

  // Don't leak error details in production
  const isDevelopment = config.server.nodeEnv === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    error: isDevelopment ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    error: err.message,
    stack: err.stack
  });
  
  // Exit process to prevent undefined state
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
  
  // Exit process to prevent undefined state
  process.exit(1);
});

// Start server
const server = app.listen(config.server.port, () => {
  logger.info(`TipMeme Paymaster Service started`, {
    port: config.server.port,
    environment: config.server.nodeEnv,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
  
  logger.info('Configuration', {
    starknet: {
      chainId: config.starknet.chainId,
      contractAddress: config.starknet.contractAddress,
      providerUrl: config.starknet.providerUrl
    },
    sponsorship: config.sponsorship,
    rateLimit: config.rateLimit,
    whitelist: {
      enabled: config.whitelist.enabled,
      addressCount: config.whitelist.addresses.length
    }
  });
});

// Handle server errors
server.on('error', (err) => {
  logger.error('Server error', {
    error: err.message,
    code: err.code,
    port: config.server.port
  });
  
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${config.server.port} is already in use`);
    process.exit(1);
  }
});

module.exports = app; 