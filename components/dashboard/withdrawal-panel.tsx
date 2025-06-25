'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, ArrowUpRight, Coins, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';

export function WithdrawalPanel() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const tokenBalances = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '12.847532',
      usdValue: '24,563.45',
      icon: '⟠',
      color: 'text-blue-600',
    },
    {
      symbol: 'STRK',
      name: 'Starknet Token',
      balance: '5,430.25',
      usdValue: '8,652.40',
      icon: '⬣',
      color: 'text-purple-600',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '2,156.78',
      usdValue: '2,156.78',
      icon: '💲',
      color: 'text-green-600',
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: '890.45',
      usdValue: '890.45',
      icon: '◈',
      color: 'text-orange-600',
    },
  ];

  const totalUsdValue = tokenBalances.reduce((sum, token) => 
    sum + parseFloat(token.usdValue.replace(',', '')), 0
  );

  const handleWithdraw = async (tokenSymbol?: string) => {
    setIsWithdrawing(true);
    
    // Simulate withdrawal process
    setTimeout(() => {
      setIsWithdrawing(false);
      if (tokenSymbol) {
        toast.success(`${tokenSymbol} withdrawal initiated successfully!`);
      } else {
        toast.success('All tokens withdrawal initiated successfully!');
      }
      setWithdrawAmount('');
    }, 2000);
  };

  const handleClaimAll = async () => {
    setIsWithdrawing(true);
    
    // Simulate claim all process
    setTimeout(() => {
      setIsWithdrawing(false);
      toast.success('All available tokens claimed successfully!');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-green-600" />
            <span>Withdrawal Overview</span>
          </CardTitle>
          <CardDescription>
            Manage your earnings and withdraw your tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalUsdValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Available to Withdraw</p>
              <p className="text-2xl font-bold text-green-600">
                ${(totalUsdValue * 0.95).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Pending Claims</p>
              <p className="text-2xl font-bold text-orange-600">
                ${(totalUsdValue * 0.05).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Token Balances */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-purple-600" />
                <span>Token Balances</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClaimAll}
                disabled={isWithdrawing}
                className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
              >
                {isWithdrawing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Claim All
              </Button>
            </CardTitle>
            <CardDescription>
              Your current token balances and values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenBalances.map((token, index) => (
              <div key={token.symbol}>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{token.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{token.symbol}</p>
                      <p className="text-sm text-gray-600">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{token.balance}</p>
                    <p className="text-sm text-gray-600">${token.usdValue}</p>
                  </div>
                </div>
                {index < tokenBalances.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Withdrawal Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
              <span>Quick Withdrawal</span>
            </CardTitle>
            <CardDescription>
              Withdraw your earnings to your connected wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                {tokenBalances.slice(0, 4).map((token) => (
                  <Button
                    key={token.symbol}
                    variant="outline"
                    className="flex items-center justify-between p-3 h-auto hover:bg-gray-50"
                    onClick={() => handleWithdraw(token.symbol)}
                    disabled={isWithdrawing}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{token.icon}</span>
                      <span className="text-sm font-medium">{token.symbol}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Custom Amount */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Custom Amount (ETH)</p>
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="text-lg"
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount('1.0')}
                  >
                    1 ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount('5.0')}
                  >
                    5 ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWithdrawAmount('12.847532')}
                  >
                    Max
                  </Button>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => handleWithdraw('ETH')}
                  disabled={isWithdrawing || !withdrawAmount}
                >
                  {isWithdrawing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                  )}
                  Withdraw ETH
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Network Fee: ~0.003 ETH
                </Badge>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Estimated confirmation time: 2-5 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}