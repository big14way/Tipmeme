const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const config = require('../config');
const { logRateLimit, logSponsorshipRequest } = require('../utils/logger');

// Cache for tracking daily sponsorship amounts per IP
const sponsorshipCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours
  checkperiod: 60 * 60  // Check for expired keys every hour
});

// Cache for tracking total daily sponsorship
const totalSponsorshipCache = new NodeCache({ 
  stdTTL: 24 * 60 * 60, // 24 hours
  checkperiod: 60 * 60  // Check for expired keys every hour
});

// Basic rate limiting middleware
const createRateLimit = () => {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logRateLimit(req.ip, req.path);
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
      });
    },
    skip: (req) => {
      // Skip rate limiting for health check endpoints
      return req.path === '/health' || req.path === '/status';
    }
  });
};

// Advanced sponsorship rate limiting
const sponsorshipRateLimit = async (req, res, next) => {
  const clientIP = req.clientIP || req.ip;
  const today = new Date().toDateString();
  const ipKey = `${clientIP}_${today}`;
  const totalKey = `total_${today}`;

  try {
    // Check daily sponsorship limits per IP
    const dailySponsorship = sponsorshipCache.get(ipKey) || 0;
    
    if (dailySponsorship >= config.sponsorship.maxDailyPerIp) {
      logSponsorshipRequest(
        clientIP, 
        req.validatedData?.userAddress || 'unknown', 
        0, 
        false, 
        new Error(`Daily sponsorship limit exceeded: ${dailySponsorship} ETH`)
      );

      return res.status(429).json({
        success: false,
        error: 'Daily sponsorship limit exceeded for this IP',
        currentUsage: dailySponsorship,
        limit: config.sponsorship.maxDailyPerIp,
        resetTime: getNextResetTime()
      });
    }

    // Check total daily sponsorship limit
    const totalSponsorship = totalSponsorshipCache.get(totalKey) || 0;
    
    if (totalSponsorship >= config.sponsorship.maxDailyTotal) {
      logSponsorshipRequest(
        clientIP, 
        req.validatedData?.userAddress || 'unknown', 
        0, 
        false, 
        new Error(`Total daily sponsorship limit exceeded: ${totalSponsorship} ETH`)
      );

      return res.status(503).json({
        success: false,
        error: 'Daily sponsorship limit reached for all users',
        totalUsage: totalSponsorship,
        limit: config.sponsorship.maxDailyTotal,
        resetTime: getNextResetTime()
      });
    }

    // Store current usage in request for later updates
    req.sponsorshipTracking = {
      ipKey,
      totalKey,
      currentIpUsage: dailySponsorship,
      currentTotalUsage: totalSponsorship
    };

    next();
  } catch (error) {
    console.error('Error in sponsorship rate limit:', error);
    next(); // Continue on error, but log it
  }
};

// Update sponsorship usage after successful transaction
const updateSponsorshipUsage = (req, gasCost) => {
  if (!req.sponsorshipTracking || !gasCost) return;

  const { ipKey, totalKey, currentIpUsage, currentTotalUsage } = req.sponsorshipTracking;

  try {
    // Update IP-based usage
    const newIpUsage = currentIpUsage + gasCost;
    sponsorshipCache.set(ipKey, newIpUsage);

    // Update total usage
    const newTotalUsage = currentTotalUsage + gasCost;
    totalSponsorshipCache.set(totalKey, newTotalUsage);

    logSponsorshipRequest(
      req.clientIP || req.ip,
      req.validatedData?.userAddress || 'unknown',
      gasCost,
      true
    );
  } catch (error) {
    console.error('Error updating sponsorship usage:', error);
  }
};

// Get sponsorship usage statistics
const getSponsorshipStats = (req, res) => {
  const clientIP = req.clientIP || req.ip;
  const today = new Date().toDateString();
  const ipKey = `${clientIP}_${today}`;
  const totalKey = `total_${today}`;

  const ipUsage = sponsorshipCache.get(ipKey) || 0;
  const totalUsage = totalSponsorshipCache.get(totalKey) || 0;

  res.json({
    success: true,
    data: {
      ip: {
        usage: ipUsage,
        limit: config.sponsorship.maxDailyPerIp,
        remaining: Math.max(0, config.sponsorship.maxDailyPerIp - ipUsage)
      },
      total: {
        usage: totalUsage,
        limit: config.sponsorship.maxDailyTotal,
        remaining: Math.max(0, config.sponsorship.maxDailyTotal - totalUsage)
      },
      resetTime: getNextResetTime()
    }
  });
};

// Helper function to get next reset time (midnight UTC)
const getNextResetTime = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
};

// Cleanup function for old cache entries
const cleanupCache = () => {
  const keys = sponsorshipCache.keys();
  const totalKeys = totalSponsorshipCache.keys();
  
  console.log(`Cleaning up ${keys.length} sponsorship cache entries and ${totalKeys.length} total cache entries`);
  
  // The NodeCache automatically handles TTL cleanup, but we can force it
  sponsorshipCache.flushAll();
  totalSponsorshipCache.flushAll();
};

// Schedule daily cleanup at midnight
const scheduleCleanup = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  setTimeout(() => {
    cleanupCache();
    // Schedule next cleanup in 24 hours
    setInterval(cleanupCache, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
};

// Initialize cleanup scheduler
scheduleCleanup();

module.exports = {
  createRateLimit,
  sponsorshipRateLimit,
  updateSponsorshipUsage,
  getSponsorshipStats,
  cleanupCache
}; 