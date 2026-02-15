'use client';

import { calculateTotals, getExpensesByCategory, getIncomeBySource, getBillsByStatus } from '@/lib/data';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Home, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const totals = calculateTotals();
  const expensesByCategory = getExpensesByCategory();
  const incomeBySource = getIncomeBySource();
  const billsByStatus = getBillsByStatus();

  const COLORS = ['#ffffff', '#999999', '#666666', '#333333', '#1a1a1a'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos finances familiales</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Revenus totaux</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {totals.income.toLocaleString('fr-FR')} €
              </p>
            </div>
            <TrendingUp className="text-foreground opacity-50" size={32} />
          </div>
        </div>

        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Dépenses</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {totals.expenses.toLocaleString('fr-FR')} €
              </p>
            </div>
            <TrendingDown className="text-foreground opacity-50" size={32} />
          </div>
        </div>

        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Factures</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {totals.bills.toLocaleString('fr-FR')} €
              </p>
            </div>
            <Home className="text-foreground opacity-50" size={32} />
          </div>
        </div>


        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Balance</p>
              <p className={`text-2xl font-bold mt-2 ${totals.balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                {totals.balance.toLocaleString('fr-FR')} €
              </p>
            </div>
            <AlertCircle className="text-foreground opacity-50" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by category */}
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
              <Tooltip formatter={(value) => `${value}€`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income by source */}
        <div className="budget-card">
          <h2 className="budget-card-header">Revenus par source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="name" stroke="#999999" />
              <YAxis stroke="#999999" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                formatter={(value) => `${value}€`}
              />
              <Bar dataKey="value" fill="hsl(var(--foreground))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bills status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Factures payées</p>
              <p className="text-2xl font-bold text-foreground mt-2">{billsByStatus.paid}</p>
            </div>
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-green-500 font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Factures en attente</p>
              <p className="text-2xl font-bold text-foreground mt-2">{billsByStatus.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <span className="text-yellow-500 font-bold">!</span>
            </div>
          </div>
        </div>

        <div className="budget-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="budget-stat-label">Factures en retard</p>
              <p className="text-2xl font-bold text-foreground mt-2">{billsByStatus.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
              <span className="text-red-500 font-bold">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings overview */}
      <div className="budget-card">
        <h2 className="budget-card-header">Épargne totale</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{totals.savings.toLocaleString('fr-FR')} €</p>
            <p className="text-muted-foreground text-sm mt-2">Épargné sur tous les objectifs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
