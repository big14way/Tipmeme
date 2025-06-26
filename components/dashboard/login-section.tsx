'use client';

import { useConnect, useDisconnect } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Users, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoginSection() {
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    console.log('Available connectors:', connectors);
    console.log('Connectors details:', connectors.map(c => ({
      id: c.id,
      name: c.name,
      available: c.available(),
      type: c.constructor.name
    })));
  }, [connectors]);

  const handleConnect = async (connector: any) => {
    try {
      console.log('Attempting to connect with connector:', connector.id);
      await connect({ connector });
      console.log('Connection successful!');
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const getWalletDisplayName = (connectorId: string): string => {
    switch (connectorId) {
      case 'argentX':
        return 'ArgentX';
      case 'braavos':
        return 'Braavos';
      default:
        return connectorId || 'Unknown Wallet';
    }
  };

  const getWalletIcon = (connectorId: string): string => {
    switch (connectorId) {
      case 'argentX':
        return '🦊';
      case 'braavos':
        return '🛡️';
      default:
        return '👛';
    }
  };



  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Creator Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your tips, track earnings, and connect with your supporters on Starknet
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Tip Leaderboard</CardTitle>
              <CardDescription>
                See your top supporters and celebrate your community
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Manage Earnings</CardTitle>
              <CardDescription>
                Track your token balances and withdraw earnings easily
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Tip History</CardTitle>
              <CardDescription>
                View all your tips with memes and supporter messages
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Login Card */}
        <Card className="max-w-md mx-auto border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Starknet wallet to access your creator dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">Connection Error:</p>
                <p className="text-red-500 text-sm">
                  {typeof error === 'string' ? error : 
                   error instanceof Error ? error.message : 
                   'Unknown error occurred'}
                </p>
              </div>
            ) : null}
            
            {connectors.length > 0 ? (
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <Button 
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={false}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    size="lg"
                  >
                    <span className="mr-2 text-lg">{getWalletIcon(connector.id)}</span>
                    <Wallet className="mr-2 h-5 w-5" />
                    {isPending ? 'Connecting...' : `Connect ${getWalletDisplayName(connector.id)}`}
                  </Button>
                ))}
                <p className="text-xs text-gray-500 text-center">
                  Found {connectors.length} connector(s). Click to connect!
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-yellow-600 font-medium">No wallets detected</p>
                <p className="text-sm text-gray-500">
                  Please install ArgentX or Braavos wallet extension to continue
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb', '_blank')}
                  >
                    Install ArgentX
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma', '_blank')}
                  >
                    Install Braavos
                  </Button>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">
              Secure connection via Starknet protocol
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}