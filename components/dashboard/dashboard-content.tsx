'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, TrendingUp, Wallet, History, Menu, Chrome, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TipLeaderboard } from './tip-leaderboard';
import { WithdrawalPanel } from './withdrawal-panel';
import { TipHistory } from './tip-history';
import { EarningsChart } from './earnings-chart';
import { StatsOverview } from './stats-overview';

export function DashboardContent() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('overview');

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TipMeme Creator Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, creator!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/extension-demo">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Extension Demo
                </Button>
              </Link>
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {address ? formatAddress(address) : 'Connected'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl shadow-lg">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="leaderboard"
                className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="withdrawal"
                className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Withdrawal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-8">
            <StatsOverview />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EarningsChart />
              </div>
              <div>
                <TipLeaderboard compact />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <TipLeaderboard />
          </TabsContent>

          <TabsContent value="withdrawal">
            <WithdrawalPanel />
          </TabsContent>

          <TabsContent value="history">
            <TipHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}