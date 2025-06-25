'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ExternalLink, 
  Heart, 
  Smile, 
  Coffee,
  Gift
} from 'lucide-react';

export function TipHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const tipHistory = [
    {
      id: '1',
      sender: 'CryptoWhale92',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      amount: '50.25',
      token: 'ETH',
      message: 'Amazing content! Keep up the great work! 🚀',
      meme: 'rocket',
      timestamp: '2024-01-15T10:30:00Z',
      txHash: '0x1234...5678',
      type: 'large',
    },
    {
      id: '2',
      sender: 'DeFiDegen',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      amount: '12.5',
      token: 'ETH',
      message: 'Love your tutorials! Here\'s some coffee money ☕',
      meme: 'coffee',
      timestamp: '2024-01-14T15:45:00Z',
      txHash: '0x2345...6789',
      type: 'medium',
    },
    {
      id: '3',
      sender: 'StarknetFan',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      amount: '5.0',
      token: 'ETH',
      message: 'Thanks for the Starknet insights! 💎',
      meme: 'diamond',
      timestamp: '2024-01-14T09:20:00Z',
      txHash: '0x3456...7890',
      type: 'small',
    },
    {
      id: '4',
      sender: 'Web3Creator',
      avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150',
      amount: '25.75',
      token: 'ETH',
      message: 'Your content helped me understand DeFi better! 🎯',
      meme: 'target',
      timestamp: '2024-01-13T18:10:00Z',
      txHash: '0x4567...8901',
      type: 'large',
    },
    {
      id: '5',
      sender: 'BlockchainBuzz',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      amount: '8.25',
      token: 'ETH',
      message: 'Keep creating awesome content! 🔥',
      meme: 'fire',
      timestamp: '2024-01-13T12:35:00Z',
      txHash: '0x5678...9012',
      type: 'medium',
    },
  ];

  const getMemeIcon = (meme: string) => {
    const memeMap = {
      rocket: '🚀',
      coffee: '☕',
      diamond: '💎',
      target: '🎯',
      fire: '🔥',
      heart: '❤️',
      smile: '😊',
    };
    return memeMap[meme as keyof typeof memeMap] || '🎉';
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      large: { label: 'Large Tip', color: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium Tip', color: 'bg-blue-100 text-blue-800' },
      small: { label: 'Small Tip', color: 'bg-purple-100 text-purple-800' },
    };
    return typeMap[type as keyof typeof typeMap] || { label: 'Tip', color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredHistory = tipHistory.filter(tip => {
    const matchesSearch = tip.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tip.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-purple-600" />
            <span>Tip History</span>
          </CardTitle>
          <CardDescription>
            Complete history of all tips received with messages and memes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by sender or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tips</SelectItem>
                <SelectItem value="large">Large Tips</SelectItem>
                <SelectItem value="medium">Medium Tips</SelectItem>
                <SelectItem value="small">Small Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tip History List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Tips ({filteredHistory.length})</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Total: {tipHistory.reduce((sum, tip) => sum + parseFloat(tip.amount), 0).toFixed(2)} ETH
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredHistory.map((tip) => (
            <div
              key={tip.id}
              className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                  <AvatarImage src={tip.avatar} alt={tip.sender} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {tip.sender.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-semibold text-gray-900">{tip.sender}</p>
                      <Badge className={getTypeBadge(tip.type).color}>
                        {getTypeBadge(tip.type).label}
                      </Badge>
                      <p className="text-xs text-gray-500">{formatDate(tip.timestamp)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-bold text-green-600">
                        {tip.amount} {tip.token}
                      </p>
                      <div className="text-2xl">{getMemeIcon(tip.meme)}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-gray-100 mb-3">
                    <p className="text-sm text-gray-700 italic">"{tip.message}"</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Thank
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View TX
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {tip.txHash}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tips found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}