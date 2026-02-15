'use client';

import { transactionsData } from '@/lib/data';
import { useState } from 'react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

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
        return <TrendingUp size={20} className="text-white" />;
      case 'expense':
        return <TrendingDown size={20} className="text-white" />;
      default:
        return <History size={20} className="text-white" />;
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
    if (type === 'income' || type === 'saving') return 'text-[#4ade80]';
    return 'text-white';
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
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <History size={32} />
          Historique des transactions
        </h1>
        <p className="text-[#999999]">Suivi complet de toutes les transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="budget-card">
          <p className="budget-stat-label mb-2">Revenus</p>
          <p className="text-3xl font-bold text-[#4ade80]">
            +{totalIncome.toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Dépenses</p>
          <p className="text-3xl font-bold text-white">
            -{totalExpense.toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Net</p>
          <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
            {(totalIncome - totalExpense).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="budget-card">
        <h2 className="budget-card-header">Filtres</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[#999999] text-sm block mb-2">Type de transaction</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#333333] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white transition-colors"
            >
              <option value="all">Tous les types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#999999] text-sm block mb-2">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#333333] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-white transition-colors"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
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
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Description</th>
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Catégorie</th>
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Membre</th>
                <th className="text-right py-3 px-4 text-[#999999] text-sm font-medium">Montant</th>
                <th className="text-right py-3 px-4 text-[#999999] text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-[#333333] hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="text-[#999999] text-sm">{getTypeLabel(transaction.type)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className="budget-tag">{transaction.category}</span>
                    </td>
                    <td className="py-3 px-4 text-[#999999]">{transaction.member}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${getAmountColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString('fr-FR')} €
                    </td>
                    <td className="py-3 px-4 text-right text-[#999999] text-sm">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-[#999999]">
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
