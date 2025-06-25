const Joi = require('joi');
const config = require('../config');
const { logSecurityEvent } = require('../utils/logger');

// Validation schemas
const sponsorRequestSchema = Joi.object({
  userAddress: Joi.string()
    .pattern(/^0x[0-9a-fA-F]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user address format',
      'any.required': 'User address is required'
    }),
  
  handle: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Handle must be at least 1 character',
      'string.max': 'Handle must be at most 50 characters',
      'any.required': 'Handle is required'
    }),
  
  nonce: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Nonce must be a numeric string',
      'any.required': 'Nonce is required'
    }),
  
  signature: Joi.array()
    .items(Joi.string().pattern(/^0x[0-9a-fA-F]+$/))
    .min(2)
    .max(2)
    .required()
    .messages({
      'array.min': 'Signature must contain exactly 2 elements',
      'array.max': 'Signature must contain exactly 2 elements',
      'any.required': 'Signature is required'
    })
});

// Validation middleware
const validateSponsorRequest = (req, res, next) => {
  const { error, value } = sponsorRequestSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    logSecurityEvent('validation_failed', {
      ip: req.ip,
      errors: errorDetails,
      body: req.body
    });

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errorDetails
    });
  }

  req.validatedData = value;
  next();
};

// Whitelist validation middleware
const validateWhitelist = (req, res, next) => {
  if (!config.whitelist.enabled) {
    return next();
  }

  const { userAddress } = req.validatedData;
  
  if (!config.whitelist.addresses.includes(userAddress.toLowerCase())) {
    logSecurityEvent('whitelist_violation', {
      ip: req.ip,
      userAddress: userAddress,
      whitelist: config.whitelist.addresses
    });

    return res.status(403).json({
      success: false,
      error: 'Address not whitelisted for testnet access'
    });
  }

  next();
};

// IP validation middleware
const validateIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Basic IP validation - reject if no IP detected
  if (!clientIP) {
    logSecurityEvent('no_ip_detected', {
      headers: req.headers,
      connection: req.connection
    });

    return res.status(400).json({
      success: false,
      error: 'Unable to determine client IP'
    });
  }

  // Store IP for rate limiting
  req.clientIP = clientIP;
  next();
};

// Content type validation
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    logSecurityEvent('invalid_content_type', {
      ip: req.ip,
      contentType: req.get('Content-Type')
    });

    return res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json'
    });
  }

  next();
};

// Request size validation
const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 1024 * 10; // 10KB max

  if (contentLength > maxSize) {
    logSecurityEvent('request_too_large', {
      ip: req.ip,
      size: contentLength,
      maxSize: maxSize
    });

    return res.status(413).json({
      success: false,
      error: 'Request payload too large'
    });
  }

  next();
};

// Sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

// General sanitization middleware
const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }
  
  next();
};

module.exports = {
  validateSponsorRequest,
  validateWhitelist,
  validateIP,
  validateContentType,
  validateRequestSize,
  sanitizeRequest,
  sponsorRequestSchema
}; 