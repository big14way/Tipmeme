'use client';

import { useAccount } from '@starknet-react/core';
import { LoginSection } from '@/components/dashboard/login-section';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!isConnected ? (
        <LoginSection />
      ) : (
        <DashboardContent />
      )}
    </main>
  );
}