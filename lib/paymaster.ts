import { Account } from 'starknet';

export interface PaymasterConfig {
  baseUrl: string;
  enabled: boolean;
}

export interface SponsorRequest {
  userAddress: string;
  handle: string;
  nonce: string;
  signature: string[];
}

export interface SponsorResponse {
  success: boolean;
  data?: {
    txHash: string;
    gasCost: number;
    gasEstimate: {
      amount: string;
      fee: string;
      price: string;
    };
    processingTime: number;
    timestamp: string;
  };
  error?: string;
  code?: string;
}

export interface GasEstimateResponse {
  success: boolean;
  data?: {
    gasAmount: string;
    gasFee: string;
    gasPrice: string;
    gasCostEth: number;
    isSponsored: boolean;
    timestamp: string;
  };
  error?: string;
}

export interface NonceResponse {
  success: boolean;
  data?: {
    address: string;
    nonce: string;
    timestamp: string;
  };
  error?: string;
}

export class PaymasterService {
  private config: PaymasterConfig;

  constructor(config: PaymasterConfig) {
    this.config = config;
  }

  /**
   * Check if paymaster service is available
   */
  async isAvailable(): Promise<boolean> {
    if (!this.config.enabled) return false;
    
    try {
      const response = await fetch(`${this.config.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Paymaster health check failed:', error);
      return false;
    }
  }

  /**
   * Get current nonce for a user address
   */
  async getNonce(address: string): Promise<NonceResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/sponsor/nonce/${address}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get nonce'
      };
    }
  }

  /**
   * Estimate gas cost for a withdraw transaction
   */
  async estimateGas(
    userAddress: string,
    handle: string,
    signature: string[]
  ): Promise<GasEstimateResponse> {
    try {
      const params = new URLSearchParams({
        userAddress,
        handle,
        signature: signature.join(',')
      });

      const response = await fetch(`${this.config.baseUrl}/api/sponsor/estimate?${params}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to estimate gas'
      };
    }
  }

  /**
   * Create signature for withdraw request
   */
  async createWithdrawSignature(
    account: Account,
    handle: string,
    nonce: string,
    contractAddress: string
  ): Promise<string[]> {
    try {
      // Create message hash for signing
      const messageHash = await this.createMessageHash(
        account.address,
        handle,
        nonce,
        contractAddress
      );

      // Sign the message hash
      const signature = await account.signMessage({
        domain: {
          name: 'TipMeme',
          version: '1',
          chainId: 'SN_SEPOLIA',
          verifyingContract: contractAddress,
        },
        types: {
          Withdraw: [
            { name: 'userAddress', type: 'felt' },
            { name: 'handle', type: 'felt' },
            { name: 'nonce', type: 'felt' },
            { name: 'contractAddress', type: 'felt' },
            { name: 'timestamp', type: 'felt' }
          ]
        },
        primaryType: 'Withdraw',
        message: {
          userAddress: account.address,
          handle: handle,
          nonce: nonce,
          contractAddress: contractAddress,
          timestamp: Math.floor(Date.now() / 1000).toString()
        }
      });

      // Handle both array and object signature formats
      if (Array.isArray(signature)) {
        return signature.map(s => s.toString());
      } else {
        return [signature.r.toString(), signature.s.toString()];
      }
    } catch (error) {
      console.error('Failed to create signature:', error);
      throw error;
    }
  }

  /**
   * Request gas sponsorship for withdraw transaction
   */
  async sponsorWithdraw(request: SponsorRequest): Promise<SponsorResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/sponsor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sponsor withdraw'
      };
    }
  }

  /**
   * Complete sponsored withdraw process
   */
  async completeSponsoredWithdraw(
    account: Account,
    handle: string,
    contractAddress: string
  ): Promise<SponsorResponse> {
    try {
      // Step 1: Get current nonce
      const nonceResponse = await this.getNonce(account.address);
      if (!nonceResponse.success || !nonceResponse.data) {
        throw new Error('Failed to get nonce');
      }

      // Step 2: Create signature
      const signature = await this.createWithdrawSignature(
        account,
        handle,
        nonceResponse.data.nonce,
        contractAddress
      );

      // Step 3: Request sponsorship
      const sponsorRequest: SponsorRequest = {
        userAddress: account.address,
        handle,
        nonce: nonceResponse.data.nonce,
        signature
      };

      return await this.sponsorWithdraw(sponsorRequest);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete sponsored withdraw'
      };
    }
  }

  /**
   * Get sponsorship usage statistics
   */
  async getUsageStats() {
    try {
      const response = await fetch(`${this.config.baseUrl}/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get usage stats'
      };
    }
  }

  /**
   * Create message hash for signing (simplified version)
   */
  private async createMessageHash(
    userAddress: string,
    handle: string,
    nonce: string,
    contractAddress: string
  ): Promise<string> {
    // This is a simplified version - in production, use proper SNIP-12
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Import hash utilities from starknet
    const { hash } = await import('starknet');
    
    return hash.computeHashOnElements([
      userAddress,
      handle,
      nonce,
      contractAddress,
      timestamp
    ]);
  }
}

// Default configuration
export const defaultPaymasterConfig: PaymasterConfig = {
  baseUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || 'http://localhost:3001',
  enabled: process.env.NEXT_PUBLIC_PAYMASTER_ENABLED === 'true'
};

// Global paymaster service instance
export const paymasterService = new PaymasterService(defaultPaymasterConfig); 