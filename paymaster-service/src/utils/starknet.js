const { Account, Provider, Contract, RpcProvider, CallData, hash, stark, typedData } = require('starknet');
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
        handle: handle,
        nonce: nonce,
        contractAddress: this.contractAddress,
        timestamp: Math.floor(Date.now() / 1000).toString()
      };

      // For Starknet, we need to hash the message using Poseidon
      const messageHash = hash.computeHashOnElements([
        userAddress,
        handle,
        nonce,
        this.contractAddress,
        message.timestamp
      ]);

      // Verify signature using account contract
      const userAccount = new Account(this.provider, userAddress, '0x0'); // No private key needed for verification
      
      try {
        const isValid = await userAccount.verifyMessage(messageHash, signature);
        return isValid;
      } catch (error) {
        logger.error('Signature verification failed', { error: error.message, userAddress, handle });
        return false;
      }
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
      if (!this.paymasterAccount) {
        throw new Error('Paymaster account not configured');
      }

      // Create contract instance
      const contract = new Contract([], this.contractAddress, this.provider);

      // Prepare call data for withdraw function
      const callData = CallData.compile({
        handle: handle,
        signature: signature
      });

      // Estimate gas for the transaction
      const gasEstimate = await this.paymasterAccount.estimateFee({
        contractAddress: this.contractAddress,
        entrypoint: 'withdraw',
        calldata: callData
      });

      const estimatedGasFee = gasEstimate.overall_fee;
      const estimatedGasAmount = gasEstimate.gas_consumed;

      logGasEstimation(
        this.contractAddress,
        'withdraw',
        estimatedGasAmount,
        null
      );

      return {
        gasAmount: estimatedGasAmount,
        gasFee: estimatedGasFee,
        gasPrice: gasEstimate.gas_price,
        success: true
      };

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
      if (!this.paymasterAccount) {
        throw new Error('Paymaster account not configured');
      }

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

      // Prepare call data
      const callData = CallData.compile({
        handle: handle,
        signature: signature
      });

      // Execute the transaction
      const result = await this.paymasterAccount.execute({
        contractAddress: this.contractAddress,
        entrypoint: 'withdraw',
        calldata: callData
      });

      logger.info('Withdraw transaction sponsored successfully', {
        txHash: result.transaction_hash,
        userAddress,
        handle,
        gasCost: gasCostEth
      });

      return {
        success: true,
        txHash: result.transaction_hash,
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
      const contract = new Contract([], this.contractAddress, this.provider);
      
      // Try to call a read-only function to verify contract is accessible
      await contract.call('is_paymaster_enabled');
      
      return { healthy: true };
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