'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Gift } from 'lucide-react';

export function StatsOverview() {
  const stats = [
    {
      title: 'Total Earnings',
      value: '12,847.32',
      unit: 'ETH',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Tips Received',
      value: '2,847',
      unit: 'tips',
      change: '+18.2%',
      changeType: 'positive' as const,
      icon: Gift,
      color: 'blue',
    },
    {
      title: 'Active Supporters',
      value: '1,234',
      unit: 'users',
      change: '+8.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Growth Rate',
      value: '24.8',
      unit: '%',
      change: '+4.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardDescription>
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline space-x-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {stat.value}
              </CardTitle>
              <span className="text-sm text-gray-500 font-medium">
                {stat.unit}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}