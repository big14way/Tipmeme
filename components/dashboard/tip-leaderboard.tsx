'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Medal, Star } from 'lucide-react';

interface TipLeaderboardProps {
  compact?: boolean;
}

export function TipLeaderboard({ compact = false }: TipLeaderboardProps) {
  const topTippers = [
    {
      rank: 1,
      name: 'CryptoWhale92',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalTips: '2,450.75',
      tipCount: 127,
      badge: 'Legendary Supporter',
      badgeColor: 'gold',
    },
    {
      rank: 2,
      name: 'DeFiDegen',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalTips: '1,875.32',
      tipCount: 94,
      badge: 'Diamond Tipper',
      badgeColor: 'diamond',
    },
    {
      rank: 3,
      name: 'StarknetFan',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalTips: '1,234.56',
      tipCount: 78,
      badge: 'Platinum Supporter',
      badgeColor: 'platinum',
    },
    {
      rank: 4,
      name: 'Web3Creator',
      avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalTips: '987.65',
      tipCount: 65,
      badge: 'Gold Supporter',
      badgeColor: 'gold',
    },
    {
      rank: 5,
      name: 'BlockchainBuzz',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      totalTips: '756.43',
      tipCount: 52,
      badge: 'Silver Supporter',
      badgeColor: 'silver',
    },
  ];

  const displayTippers = compact ? topTippers.slice(0, 5) : topTippers;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (badgeColor: string) => {
    const colorMap = {
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      diamond: 'bg-gradient-to-r from-blue-400 to-purple-600 text-white',
      platinum: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
      silver: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
    };
    return colorMap[badgeColor as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span>Top Supporters</span>
        </CardTitle>
        <CardDescription>
          Your most generous supporters this month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayTippers.map((tipper) => (
          <div
            key={tipper.rank}
            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100">
                {getRankIcon(tipper.rank)}
              </div>
              <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
                <AvatarImage src={tipper.avatar} alt={tipper.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  {tipper.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {tipper.name}
                </p>
                <Badge className={`text-xs px-2 py-1 ${getBadgeColor(tipper.badgeColor)}`}>
                  {tipper.badge}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">{tipper.totalTips} ETH</span>
                </p>
                <p className="text-xs text-gray-500">
                  {tipper.tipCount} tips
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {compact && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              View all supporters in the Leaderboard tab
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}