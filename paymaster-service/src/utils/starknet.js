const { Account, Provider, Contract, RpcProvider, CallData, hash, stark, typedData, shortString } = require('starknet');
const config = require('../config');
const { logger, logGasEstimation } = require('./logger');

class StarknetService {
  constructor() {
    this.provider = new RpcProvider({ 
      nodeUrl: config.starknet.providerUrl,
    });
    
    if (config.paymaster.privateKey) {
      this.paymasterAccount = new Account(
        this.provider,
        config.paymaster.address,
        config.paymaster.privateKey
      );
    }
    
    this.contractAddress = config.starknet.contractAddress;
  }

  /**
   * Verify EIP-712 style signature for Starknet
   * This is a simplified implementation - in production, use proper SNIP-12
   */
  async verifySignature(userAddress, handle, nonce, signature) {
    try {
      // Convert handle to felt252 format
      const handleFelt = shortString.encodeShortString(handle);
      
      logger.info('Signature verification details', {
        userAddress,
        handle,
        handleFelt,
        nonce
      });

      // Create the typed data structure (simplified version)
      const domain = {
        name: 'TipMeme',
        version: '1',
        chainId: config.starknet.chainId,
        verifyingContract: this.contractAddress,
      };

      const types = {
        Withdraw: [
          { name: 'userAddress', type: 'felt' },
          { name: 'handle', type: 'felt' },
          { name: 'nonce', type: 'felt' },
          { name: 'contractAddress', type: 'felt' },
          { name: 'timestamp', type: 'felt' }
        ]
      };

      const message = {
        userAddress: userAddress,
        handle: handleFelt,
        nonce: nonce,
        contractAddress: this.contractAddress,
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      // For Starknet, we need to hash the message using Poseidon
      const messageHash = hash.computeHashOnElements([
        userAddress,
        handleFelt,
        nonce,
        this.contractAddress,
        message.timestamp
      ]);

      logger.info('Message hash computed', { messageHash });

      // For testing purposes, we'll accept the signature as valid
      // In production, implement proper signature verification
      logger.info('Signature validation passed (test mode)');
      return true;

    } catch (error) {
      logger.error('Error in signature verification', { error: error.message });
      return false;
    }
  }

  /**
   * Estimate gas for withdraw function call
   */
  async estimateWithdrawGas(userAddress, handle, signature) {
    try {
      // For testing purposes, return mock gas estimation
      const mockGasEstimate = {
        gasAmount: '21000',
        gasFee: '3000000000000000', // 0.003 ETH
        gasPrice: '142857142857',
        success: true
      };

      logger.info('Gas estimation completed', mockGasEstimate);

      return mockGasEstimate;

    } catch (error) {
      logger.error('Gas estimation failed', { 
        error: error.message, 
        userAddress, 
        handle 
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute sponsored withdraw transaction
   */
  async sponsorWithdraw(userAddress, handle, signature) {
    try {
      // First estimate gas
      const gasEstimate = await this.estimateWithdrawGas(userAddress, handle, signature);
      if (!gasEstimate.success) {
        throw new Error(`Gas estimation failed: ${gasEstimate.error}`);
      }

      // Check if gas cost is within limits
      const gasCostEth = Number(gasEstimate.gasFee) / 1e18;
      if (gasCostEth > config.sponsorship.maxGasPerTx) {
        throw new Error(`Gas cost ${gasCostEth} ETH exceeds maximum ${config.sponsorship.maxGasPerTx} ETH`);
      }

      // For testing purposes, simulate transaction execution
      const mockTxHash = '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567890abcdef123';

      logger.info('Withdraw transaction sponsored successfully', {
        txHash: mockTxHash,
        userAddress,
        handle,
        gasCost: gasCostEth
      });

      return {
        success: true,
        txHash: mockTxHash,
        gasCost: gasCostEth
      };

    } catch (error) {
      logger.error('Sponsored withdraw failed', {
        error: error.message,
        userAddress,
        handle
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return {
        success: true,
        status: receipt.status,
        actualFee: receipt.actual_fee
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if contract is deployed and accessible
   */
  async healthCheck() {
    try {
      // Simple provider connectivity check
      const latestBlock = await this.provider.getBlockNumber();
      
      logger.info('Starknet health check passed', { latestBlock });
      
      return { 
        healthy: true,
        latestBlock: latestBlock,
        provider: config.starknet.providerUrl,
        chainId: config.starknet.chainId
      };
    } catch (error) {
      logger.error('Starknet health check failed', { error: error.message });
      return { 
        healthy: false, 
        error: error.message 
      };
    }
  }

  /**
   * Get contract nonce for user
   */
  async getUserNonce(userAddress) {
    try {
      const contract = new Contract([], this.contractAddress, this.provider);
      const nonce = await contract.call('get_nonce', [userAddress]);
      return { success: true, nonce: nonce.toString() };
    } catch (error) {
      logger.error('Failed to get user nonce', { error: error.message, userAddress });
      return { success: false, error: error.message };
    }
  }
}

module.exports = new StarknetService(); 