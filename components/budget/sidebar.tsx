'use client';

import { useState } from 'react';
import {
  Home,
  TrendingUp,
  TrendingDown,
  FileText,
  RefreshCw,
  PiggyBank,
  History,


  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}


export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'income', label: 'Revenus', icon: TrendingUp },
    { id: 'expenses', label: 'Dépenses', icon: TrendingDown },
    { id: 'bills', label: 'Factures', icon: FileText },
    { id: 'reimbursement', label: 'Remboursements', icon: RefreshCw },
    { id: 'savings', label: 'Épargne', icon: PiggyBank },
    { id: 'transactions', label: 'Transactions', icon: History },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border p-6 transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        <div className="flex items-center gap-3 mb-8 mt-12 md:mt-0">
          <div className="w-10 h-10 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
            B
          </div>
          <div>
            <h1 className="text-sidebar-foreground font-bold text-lg">Budget</h1>
            <p className="text-sidebar-foreground/70 text-xs">Familial</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sections.map(({ id, label, icon: Icon }) => (

            <button
              key={id}
              onClick={() => handleSectionClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>


        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="text-sm text-sidebar-foreground font-medium">{user?.name}</div>
            </div>

            <button
              onClick={logout}
              className="text-sidebar-foreground/70 hover:text-destructive transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 text-sidebar-foreground/50">
            <p className="text-xs">
              Budget Familial v1.0
            </p>
            <ModeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
