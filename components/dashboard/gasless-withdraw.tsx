'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { paymasterService } from '@/lib/paymaster';

interface WithdrawStatus {
  type: 'idle' | 'estimating' | 'signing' | 'sponsoring' | 'success' | 'error';
  message?: string;
  txHash?: string;
  gasCost?: number;
}

export function GaslessWithdraw() {
  const { account, address } = useAccount();
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState<WithdrawStatus>({ type: 'idle' });
  const [isPaymasterAvailable, setIsPaymasterAvailable] = useState<boolean | null>(null);
  const [gasEstimate, setGasEstimate] = useState<any>(null);

  // Check paymaster availability on component mount
  useState(() => {
    checkPaymasterStatus();
  });

  const checkPaymasterStatus = async () => {
    const available = await paymasterService.isAvailable();
    setIsPaymasterAvailable(available);
  };

  const estimateGasCost = async () => {
    if (!account || !handle) return;

    setStatus({ type: 'estimating', message: 'Estimating gas costs...' });

    try {
      // Create a temporary signature for estimation
      const tempSignature = ['0x1', '0x1']; // Placeholder for estimation
      
      const estimate = await paymasterService.estimateGas(
        address!,
        handle,
        tempSignature
      );

      if (estimate.success && estimate.data) {
        setGasEstimate(estimate.data);
        setStatus({ type: 'idle' });
      } else {
        setStatus({ 
          type: 'error', 
          message: estimate.error || 'Failed to estimate gas' 
        });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Estimation failed' 
      });
    }
  };

  const handleGaslessWithdraw = async () => {
    if (!account || !handle) return;

    setStatus({ type: 'signing', message: 'Please sign the transaction...' });

    try {
      const contractAddress = '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e';
      
      setStatus({ type: 'sponsoring', message: 'Processing sponsored transaction...' });

      const result = await paymasterService.completeSponsoredWithdraw(
        account,
        handle,
        contractAddress
      );

      if (result.success && result.data) {
        setStatus({
          type: 'success',
          message: 'Withdraw completed successfully!',
          txHash: result.data.txHash,
          gasCost: result.data.gasCost
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Transaction failed'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Transaction failed'
      });
    }
  };

  const handleRegularWithdraw = async () => {
    // Fallback to regular withdraw if paymaster is not available
    // This would implement the standard withdraw logic
    setStatus({ type: 'error', message: 'Regular withdraw not implemented yet' });
  };

  const isLoading = ['estimating', 'signing', 'sponsoring'].includes(status.type);
  const canWithdraw = account && handle && !isLoading;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Gasless Withdraw
            </CardTitle>
            <CardDescription>
              Withdraw your tips without paying gas fees
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isPaymasterAvailable === true && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Gasless Available
              </Badge>
            )}
            {isPaymasterAvailable === false && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Gasless Unavailable
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Handle Input */}
        <div className="space-y-2">
          <Label htmlFor="handle">Twitter Handle</Label>
          <Input
            id="handle"
            placeholder="your_twitter_handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Gas Estimate Display */}
        {gasEstimate && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Gas Estimate</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Gas Cost:</span>
                <span className="ml-2 font-medium">{gasEstimate.gasCostEth} ETH</span>
              </div>
              <div>
                <span className="text-blue-700">Will be sponsored:</span>
                <span className="ml-2 font-medium">
                  {gasEstimate.isSponsored ? '✅ Yes' : '❌ No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Status Display */}
        {status.type !== 'idle' && (
          <Alert className={
            status.type === 'success' ? 'border-green-200 bg-green-50' :
            status.type === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }>
            <div className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {status.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {status.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
              
              <AlertDescription className={
                status.type === 'success' ? 'text-green-800' :
                status.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }>
                {status.message}
              </AlertDescription>
            </div>
            
            {status.txHash && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-green-700">Transaction Hash:</span>
                <a
                  href={`https://sepolia.starkscan.co/tx/${status.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {status.txHash.slice(0, 10)}...{status.txHash.slice(-8)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            
            {status.gasCost && (
              <div className="mt-1">
                <span className="text-sm text-green-700">Gas Sponsored: {status.gasCost} ETH</span>
              </div>
            )}
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={estimateGasCost}
            disabled={!canWithdraw}
            variant="outline"
            className="flex-1"
          >
            {status.type === 'estimating' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Estimate Gas
          </Button>

          {isPaymasterAvailable ? (
            <Button
              onClick={handleGaslessWithdraw}
              disabled={!canWithdraw}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Zap className="mr-2 h-4 w-4" />
              Gasless Withdraw
            </Button>
          ) : (
            <Button
              onClick={handleRegularWithdraw}
              disabled={!canWithdraw}
              variant="outline"
              className="flex-1"
            >
              Regular Withdraw
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Gasless withdrawals are sponsored up to 0.01 ETH per transaction</p>
          <p>• Maximum 0.1 ETH per day per user</p>
          <p>• Signature verification ensures secure transactions</p>
          {!account && (
            <p className="text-orange-600 font-medium">
              • Please connect your wallet to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 