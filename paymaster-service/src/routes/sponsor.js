const express = require('express');
const router = express.Router();

const starknetService = require('../utils/starknet');
const { 
  validateSponsorRequest, 
  validateWhitelist, 
  validateIP, 
  validateContentType,
  validateRequestSize,
  sanitizeRequest 
} = require('../middleware/validation');
const { sponsorshipRateLimit, updateSponsorshipUsage } = require('../middleware/rateLimit');
const { logger, logTransaction, logSponsorshipRequest } = require('../utils/logger');

/**
 * POST /sponsor - Main endpoint for sponsoring withdraw() calls
 * 
 * Request Body:
 * {
 *   "userAddress": "0x...",
 *   "handle": "twitter_handle",
 *   "nonce": "123",
 *   "signature": ["0x...", "0x..."]
 * }
 */
router.post('/sponsor', 
  validateIP,
  validateContentType,
  validateRequestSize,
  sanitizeRequest,
  validateSponsorRequest,
  validateWhitelist,
  sponsorshipRateLimit,
  async (req, res) => {
    const startTime = Date.now();
    const { userAddress, handle, nonce, signature } = req.validatedData;
    const clientIP = req.clientIP || req.ip;

    try {
      logger.info('Sponsorship request received', {
        userAddress,
        handle,
        nonce,
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      // Step 1: Verify signature
      logger.info('Verifying signature...');
      const isValidSignature = await starknetService.verifySignature(
        userAddress, 
        handle, 
        nonce, 
        signature
      );

      if (!isValidSignature) {
        logSponsorshipRequest(
          clientIP,
          userAddress,
          0,
          false,
          new Error('Invalid signature verification')
        );

        return res.status(400).json({
          success: false,
          error: 'Invalid signature',
          code: 'INVALID_SIGNATURE'
        });
      }

      logger.info('Signature verified successfully');

      // Step 2: Estimate gas fees
      logger.info('Estimating gas fees...');
      const gasEstimate = await starknetService.estimateWithdrawGas(
        userAddress, 
        handle, 
        signature
      );

      if (!gasEstimate.success) {
        logSponsorshipRequest(
          clientIP,
          userAddress,
          0,
          false,
          new Error(`Gas estimation failed: ${gasEstimate.error}`)
        );

        return res.status(400).json({
          success: false,
          error: 'Gas estimation failed',
          details: gasEstimate.error,
          code: 'GAS_ESTIMATION_FAILED'
        });
      }

      const gasCostEth = Number(gasEstimate.gasFee) / 1e18;
      
      logger.info('Gas estimation successful', {
        gasAmount: gasEstimate.gasAmount,
        gasFee: gasEstimate.gasFee,
        gasCostEth: gasCostEth
      });

      // Step 3: Check gas cost limits
      if (gasCostEth > 0.01) { // Max 0.01 ETH per transaction
        logSponsorshipRequest(
          clientIP,
          userAddress,
          gasCostEth,
          false,
          new Error(`Gas cost too high: ${gasCostEth} ETH`)
        );

        return res.status(400).json({
          success: false,
          error: 'Gas cost exceeds maximum allowed',
          gasCost: gasCostEth,
          maxAllowed: 0.01,
          code: 'GAS_COST_TOO_HIGH'
        });
      }

      // Step 4: Execute sponsored transaction
      logger.info('Executing sponsored transaction...');
      const sponsorResult = await starknetService.sponsorWithdraw(
        userAddress,
        handle,
        signature
      );

      if (!sponsorResult.success) {
        logSponsorshipRequest(
          clientIP,
          userAddress,
          gasCostEth,
          false,
          new Error(`Transaction execution failed: ${sponsorResult.error}`)
        );

        return res.status(500).json({
          success: false,
          error: 'Transaction execution failed',
          details: sponsorResult.error,
          code: 'TRANSACTION_FAILED'
        });
      }

      // Step 5: Update sponsorship usage tracking
      updateSponsorshipUsage(req, sponsorResult.gasCost);

      // Step 6: Log successful transaction
      logTransaction(
        sponsorResult.txHash,
        'sponsored_withdraw',
        {
          userAddress,
          handle,
          gasCost: sponsorResult.gasCost,
          processingTime: Date.now() - startTime
        }
      );

      logger.info('Sponsorship completed successfully', {
        txHash: sponsorResult.txHash,
        gasCost: sponsorResult.gasCost,
        processingTime: Date.now() - startTime
      });

      // Return success response
      res.json({
        success: true,
        data: {
          txHash: sponsorResult.txHash,
          gasCost: sponsorResult.gasCost,
          gasEstimate: {
            amount: gasEstimate.gasAmount,
            fee: gasEstimate.gasFee,
            price: gasEstimate.gasPrice
          },
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('Unexpected error in sponsor endpoint', {
        error: error.message,
        stack: error.stack,
        userAddress,
        handle,
        processingTime
      });

      logSponsorshipRequest(
        clientIP,
        userAddress,
        0,
        false,
        error
      );

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        processingTime
      });
    }
  }
);

/**
 * GET /sponsor/estimate - Estimate gas costs without executing transaction
 */
router.get('/sponsor/estimate',
  validateIP,
  async (req, res) => {
    const { userAddress, handle, signature } = req.query;

    if (!userAddress || !handle || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: userAddress, handle, signature'
      });
    }

    try {
      const signatureArray = Array.isArray(signature) ? signature : [signature];
      
      const gasEstimate = await starknetService.estimateWithdrawGas(
        userAddress,
        handle,
        signatureArray
      );

      if (!gasEstimate.success) {
        return res.status(400).json({
          success: false,
          error: 'Gas estimation failed',
          details: gasEstimate.error
        });
      }

      const gasCostEth = Number(gasEstimate.gasFee) / 1e18;

      res.json({
        success: true,
        data: {
          gasAmount: gasEstimate.gasAmount,
          gasFee: gasEstimate.gasFee,
          gasPrice: gasEstimate.gasPrice,
          gasCostEth: gasCostEth,
          isSponsored: gasCostEth <= 0.01, // Will this be sponsored?
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Error in gas estimation endpoint', {
        error: error.message,
        userAddress,
        handle
      });

      res.status(500).json({
        success: false,
        error: 'Gas estimation failed',
        details: error.message
      });
    }
  }
);

/**
 * GET /sponsor/nonce/:address - Get current nonce for user address
 */
router.get('/sponsor/nonce/:address',
  validateIP,
  async (req, res) => {
    const { address } = req.params;

    if (!address || !address.match(/^0x[0-9a-fA-F]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format'
      });
    }

    try {
      const nonceResult = await starknetService.getUserNonce(address);

      if (!nonceResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Failed to get nonce',
          details: nonceResult.error
        });
      }

      res.json({
        success: true,
        data: {
          address: address,
          nonce: nonceResult.nonce,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Error getting user nonce', {
        error: error.message,
        address
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get nonce',
        details: error.message
      });
    }
  }
);

module.exports = router; 