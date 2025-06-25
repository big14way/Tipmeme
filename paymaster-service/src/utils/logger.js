const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure logs directory exists
const logsDir = path.dirname(config.logging.file);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'tipmeme-paymaster' },
  transports: [
    // File transport for all logs
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (config.server.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Custom logging methods for different scenarios
const logTransaction = (txHash, action, metadata = {}) => {
  logger.info('Transaction processed', {
    txHash,
    action,
    ...metadata,
    timestamp: new Date().toISOString()
  });
};

const logSponsorshipRequest = (ip, address, amount, success, error = null) => {
  const logData = {
    ip,
    address,
    amount,
    success,
    timestamp: new Date().toISOString()
  };
  
  if (error) {
    logData.error = error.message;
    logData.stack = error.stack;
  }
  
  if (success) {
    logger.info('Sponsorship request processed', logData);
  } else {
    logger.warn('Sponsorship request failed', logData);
  }
};

const logRateLimit = (ip, endpoint) => {
  logger.warn('Rate limit exceeded', {
    ip,
    endpoint,
    timestamp: new Date().toISOString()
  });
};

const logSecurityEvent = (event, details) => {
  logger.warn('Security event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

const logGasEstimation = (contractAddress, functionName, estimatedGas, actualGas = null) => {
  logger.info('Gas estimation', {
    contractAddress,
    functionName,
    estimatedGas,
    actualGas,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logTransaction,
  logSponsorshipRequest,
  logRateLimit,
  logSecurityEvent,
  logGasEstimation
}; 