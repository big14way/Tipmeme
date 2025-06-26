'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Wallet, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Gift, 
  Zap, 
  CheckCircle, 
  ExternalLink,
  Loader2,
  Rocket
} from 'lucide-react';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
}

export function DemoRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState('idle');
  const [finalBalance, setFinalBalance] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Creator Wallet Login",
      description: "Connect ArgentX wallet and verify account",
      duration: 3000,
      completed: false
    },
    {
      id: 2,
      title: "Dashboard Overview",
      description: "Display earnings stats and analytics",
      duration: 2000,
      completed: false
    },
    {
      id: 3,
      title: "Pending Balance",
      description: "Show 1 TEST token ready to withdraw",
      duration: 2000,
      completed: false
    },
    {
      id: 4,
      title: "Recent Tip",
      description: "Display tip from @tippertest with message",
      duration: 2500,
      completed: false
    },
    {
      id: 5,
      title: "Meme Preview",
      description: "Generate rocket meme by PixelLab",
      duration: 2000,
      completed: false
    },
    {
      id: 6,
      title: "Gasless Withdrawal",
      description: "Process sponsored withdrawal transaction",
      duration: 4000,
      completed: false
    },
    {
      id: 7,
      title: "Balance Confirmation",
      description: "Verify wallet balance increased by 1 TEST",
      duration: 2000,
      completed: false
    }
  ];

  const [steps, setSteps] = useState(demoSteps);

  const mockData = {
    wallet: {
      address: '0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb',
      type: 'ArgentX',
      network: 'Starknet Sepolia'
    },
    stats: {
      totalEarnings: '2.547 ETH',
      tipsReceived: '847',
      activeSupporter: '234',
      growthRate: '+18.5%'
    },
    pendingBalance: {
      testTokens: '1 TEST',
      ethValue: '0.001 ETH',
      usdValue: '$2.45'
    },
    recentTip: {
      from: '@tippertest',
      amount: '1 TEST',
      message: 'Love your crypto content! Here\'s some support 🚀',
      timestamp: 'Just now',
      txHash: '0x789ef456gh123abc'
    },
    withdrawal: {
      txHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
      blockNumber: 887457,
      gasUsed: '0.003 ETH',
      explorerUrl: 'https://sepolia.voyager.online/tx/0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz'
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setCurrentStep(0);
    setProgress(0);
    
    // Reset all states
    setShowBalance(false);
    setShowTip(false);
    setShowMeme(false);
    setShowWithdrawal(false);
    setWithdrawalStatus('idle');
    setFinalBalance(false);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update progress
      const stepProgress = ((i + 1) / steps.length) * 100;
      setProgress(stepProgress);

      // Show specific UI elements based on step
      switch (i) {
        case 2: // Pending Balance
          setShowBalance(true);
          break;
        case 3: // Recent Tip
          setShowTip(true);
          break;
        case 4: // Meme Preview
          setShowMeme(true);
          break;
        case 5: // Gasless Withdrawal
          setShowWithdrawal(true);
          await simulateWithdrawal();
          break;
        case 6: // Final Balance
          setFinalBalance(true);
          break;
      }

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, completed: true } : step
      ));

      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    setIsRecording(false);
  };

  const simulateWithdrawal = async () => {
    setWithdrawalStatus('estimating');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setWithdrawalStatus('signing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setWithdrawalStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setWithdrawalStatus('success');
  };

  const resetDemo = () => {
    setIsRecording(false);
    setCurrentStep(0);
    setProgress(0);
    setShowBalance(false);
    setShowTip(false);
    setShowMeme(false);
    setShowWithdrawal(false);
    setWithdrawalStatus('idle');
    setFinalBalance(false);
    setSteps(demoSteps);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Demo Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-purple-600" />
            <span>Creator Dashboard Demo Recording</span>
          </CardTitle>
          <CardDescription>
            Live demonstration of complete withdrawal workflow for screen recording
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Button
              onClick={startRecording}
              disabled={isRecording}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isRecording ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRecording ? 'Recording...' : 'Start Demo Recording'}
            </Button>
            <Button variant="outline" onClick={resetDemo} disabled={isRecording}>
              Reset Demo
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ready for Screen Capture
            </Badge>
          </div>
          
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
                </span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Progress */}
      {isRecording && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recording Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      index === currentStep ? 'text-blue-600' : 
                      step.completed ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Connection Display */}
      {isRecording && currentStep >= 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <span>Wallet Connected</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ArgentX
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><strong>Address:</strong> {mockData.wallet.address}</p>
              <p className="text-sm"><strong>Network:</strong> {mockData.wallet.network}</p>
              <p className="text-sm"><strong>Handle:</strong> @creatortest</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Stats */}
      {isRecording && currentStep >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.stats.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tips Received</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.stats.tipsReceived}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Supporters</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.stats.activeSupporter}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{mockData.stats.growthRate}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Balance */}
      {showBalance && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-green-600" />
              <span>Pending Balance</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready to Withdraw
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">TEST Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{mockData.pendingBalance.testTokens}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">ETH Value</p>
                <p className="text-2xl font-bold text-blue-600">{mockData.pendingBalance.ethValue}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">USD Value</p>
                <p className="text-2xl font-bold text-green-600">{mockData.pendingBalance.usdValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Tip */}
      {showTip && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Tip from @tippertest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150" />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="font-semibold">{mockData.recentTip.from}</p>
                  <Badge className="bg-green-100 text-green-800">
                    {mockData.recentTip.amount}
                  </Badge>
                  <p className="text-sm text-gray-500">{mockData.recentTip.timestamp}</p>
                </div>
                <p className="text-gray-700 mb-2">{mockData.recentTip.message}</p>
                <p className="text-xs text-blue-600">
                  Tx: {mockData.recentTip.txHash}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meme Preview */}
      {showMeme && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-orange-600" />
              <span>Meme Preview by PixelLab</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">When you get a tip for your crypto content</h3>
              <p className="text-gray-600 mb-4">TO THE MOON!</p>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Generated by PixelLab AI
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gasless Withdrawal */}
      {showWithdrawal && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Gasless Withdrawal</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Paymaster Available
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Handle</p>
                  <p className="font-semibold">@creatortest</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold">1 TEST</p>
                </div>
              </div>
              
              {withdrawalStatus !== 'idle' && (
                <Alert className={
                  withdrawalStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
                }>
                  <div className="flex items-center space-x-2">
                    {withdrawalStatus === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    )}
                    <AlertDescription className={
                      withdrawalStatus === 'success' ? 'text-green-800' : 'text-blue-800'
                    }>
                      {withdrawalStatus === 'estimating' && 'Estimating gas costs...'}
                      {withdrawalStatus === 'signing' && 'Please sign the transaction...'}
                      {withdrawalStatus === 'processing' && 'Processing sponsored transaction...'}
                      {withdrawalStatus === 'success' && 'Withdrawal completed successfully!'}
                    </AlertDescription>
                  </div>
                  
                  {withdrawalStatus === 'success' && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-green-700">
                        Transaction Hash: {mockData.withdrawal.txHash.slice(0, 10)}...{mockData.withdrawal.txHash.slice(-8)}
                      </p>
                      <p className="text-sm text-green-700">Gas Sponsored: {mockData.withdrawal.gasUsed}</p>
                      <a
                        href={mockData.withdrawal.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        View on Voyager
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Balance Confirmation */}
      {finalBalance && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Wallet Balance Updated</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Before Withdrawal</h4>
                <div className="space-y-1">
                  <p className="text-sm">TEST Tokens: 0 TEST</p>
                  <p className="text-sm">ETH Balance: 2.456 ETH</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">After Withdrawal</h4>
                <div className="space-y-1">
                  <p className="text-sm text-green-600 font-semibold">TEST Tokens: 1 TEST ✅</p>
                  <p className="text-sm">ETH Balance: 2.456 ETH (gas sponsored)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 font-semibold">
                ✅ Balance increased by 1 TEST token
              </p>
              <p className="text-sm text-green-700">
                💸 Gas saved: 0.003 ETH (sponsored by paymaster)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 