'use client';

import { transactionsData } from '@/lib/data';
import { useState } from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function TransactionsSection() {
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(transactionsData.map(t => t.category)));
  const types = ['income', 'expense', 'bill', 'saving', 'reimbursement'];

  const filteredTransactions = transactionsData.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp size={20} className="text-foreground" />;
      case 'expense':
        return <TrendingDown size={20} className="text-foreground" />;
      default:
        return <History size={20} className="text-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Revenu';
      case 'expense':
        return 'Dépense';
      case 'bill':
        return 'Facture';
      case 'saving':
        return 'Épargne';
      case 'reimbursement':
        return 'Remboursement';
      default:
        return type;
    }
  };

  const getAmountColor = (type: string) => {
    if (type === 'income' || type === 'saving') return 'text-green-600 dark:text-green-400';
    return 'text-foreground';
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => ['expense', 'bill', 'reimbursement'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <History size={32} />
          Historique des transactions
        </h1>
        <p className="text-muted-foreground">Suivi complet de toutes les transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="budget-card">
          <p className="budget-stat-label mb-2">Revenus</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            +{totalIncome.toLocaleString('fr-FR')} Ar
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Dépenses</p>
          <p className="text-3xl font-bold text-foreground">
            -{totalExpense.toLocaleString('fr-FR')} Ar
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Net</p>
          <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {(totalIncome - totalExpense).toLocaleString('fr-FR')} Ar
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="budget-card">
        <h2 className="budget-card-header mb-4">Filtrer les transactions</h2>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Type</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-primary transition-all">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="all" className="focus:bg-primary focus:text-primary-foreground">Tous les types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type} className="focus:bg-primary focus:text-primary-foreground">
                    {getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Catégorie</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full bg-background border-border text-foreground focus:ring-primary transition-all">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="all" className="focus:bg-primary focus:text-primary-foreground">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="focus:bg-primary focus:text-primary-foreground">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors md:mb-0"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Transactions list */}
      <div className="budget-card">
        <h2 className="budget-card-header">
          Transactions ({filteredTransactions.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Description</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Catégorie</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Membre</th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">Montant</th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="text-muted-foreground text-sm">{getTypeLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className="budget-tag">{transaction.category}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{transaction.member}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString('fr-FR')} Ar
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground text-sm">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-muted-foreground">
                    Aucune transaction trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
