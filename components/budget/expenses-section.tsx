'use client';

import { useState } from 'react';
import { useBudget } from '@/lib/budget-context';
import { getExpensesByCategory } from '@/lib/data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { ExpenseModal } from './modals/expense-modal';
import { ConfirmationModal } from './modals/confirmation-modal';

export default function ExpensesSection() {
  const { data, addExpense, updateExpense, deleteExpense, clearExpenses } = useBudget();
  const expenseData = data.expenses;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleAddExpense = (expense: any) => {
    if (editingId) {
      updateExpense(editingId, expense);
      setEditingId(null);
    } else {
      addExpense(expense);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const expensesByCategory = getExpensesByCategory(expenseData);
  const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <TrendingDown size={32} />
            Dépenses
          </h1>
          <p className="text-muted-foreground">Suivi des dépenses familiales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="budget-button flex items-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
          {expenseData.length > 0 && (
            <button onClick={() => setClearConfirm(true)} className="budget-button-secondary">
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Total expenses */}
      <div className="budget-card">
        <p className="budget-stat-label mb-4">Total des dépenses</p>
        <p className="text-4xl font-bold text-foreground">{totalExpenses.toLocaleString('fr-FR')} Ar</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by category pie chart */}
        <div className="budget-card">
          <h2 className="budget-card-header">Dépenses par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                formatter={(value) => `${value}Ar`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="budget-card">
          <h2 className="budget-card-header">Résumé par catégorie</h2>
          <div className="space-y-3">
            {expensesByCategory.map((category, index) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-foreground font-medium">{category.name}</span>
                  <span className="text-foreground font-semibold">{category.value}Ar</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(category.value / totalExpenses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense details */}
      <div className="budget-card">
        <h2 className="budget-card-header">Détails des dépenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Description</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Catégorie</th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Membre</th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">Montant</th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">Date</th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map(expense => (
                <tr key={expense.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{expense.description}</td>
                  <td className="py-3 px-4">
                    <span className="budget-tag">{expense.category}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{expense.member}</td>
                  <td className="py-3 px-4 text-right text-foreground font-semibold">
                    {expense.amount.toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground text-sm">
                    {new Date(expense.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditClick(expense.id)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title="Éditer"
                    >
                      <Edit2 size={16} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(expense.id)}
                      className="p-2 hover:bg-red-600/20 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={isModalOpen}
        expense={editingId ? expenseData.find((e) => e.id === editingId) : undefined}
        onSubmit={handleAddExpense}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        title="Supprimer la dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          if (deleteConfirm) deleteExpense(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Vider toutes les dépenses"
        message="Êtes-vous sûr de vouloir supprimer toutes les dépenses ? Cette action ne peut pas être annulée."
        confirmText="Vider"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          clearExpenses();
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
