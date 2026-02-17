'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import LoginScreen from '@/components/budget/login-screen';
import RegisterScreen from '@/components/budget/register-screen';
import Sidebar from '@/components/budget/sidebar';
import Dashboard from '@/components/budget/dashboard';
import IncomeSection from '@/components/budget/income-section';
import ExpensesSection from '@/components/budget/expenses-section';
import BillsSection from '@/components/budget/bills-section';
import ReimbursementSection from '@/components/budget/reimbursement-section';
import SavingsSection from '@/components/budget/savings-section';
import TransactionsSection from '@/components/budget/transactions-section';

export default function Page() {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginScreen onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterScreen onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeSection />;
      case 'expenses':
        return <ExpensesSection />;
      case 'bills':
        return <BillsSection />;
      case 'reimbursement':
        return <ReimbursementSection />;
      case 'savings':
        return <SavingsSection />;
      case 'transactions':
        return <TransactionsSection />;
      default:
        return <Dashboard />;
    }
  };


  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="md:ml-0 p-4 md:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
