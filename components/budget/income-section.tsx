'use client';

import { useState } from 'react';
import { useBudget } from '@/lib/budget-context';
import { getIncomeBySource } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';
import { IncomeModal } from './modals/income-modal';
import { ConfirmationModal } from './modals/confirmation-modal';

export default function IncomeSection() {
  const { data, addIncome, updateIncome, deleteIncome, clearIncomes } = useBudget();
  const incomeData = data.incomes;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleAddIncome = (income: any) => {
    if (editingId) {
      updateIncome(editingId, income);
      setEditingId(null);
    } else {
      addIncome(income);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const incomeBySource = getIncomeBySource(incomeData);
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
  const memberIncome: { [key: string]: number } = {};

  incomeData.forEach(income => {
    memberIncome[income.member] = (memberIncome[income.member] || 0) + income.amount;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp size={32} />
            Revenus
          </h1>
          <p className="text-[#999999]">Gestion des revenus familiaux</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="budget-button flex items-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
          {incomeData.length > 0 && (
            <button onClick={() => setClearConfirm(true)} className="budget-button-secondary">
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Total income */}
      <div className="budget-card">
        <p className="budget-stat-label mb-4">Total des revenus</p>
        <p className="text-4xl font-bold text-white">{totalIncome.toLocaleString('fr-FR')} €</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by source */}
        <div className="budget-card">
          <h2 className="budget-card-header">Revenus par source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="name" stroke="#999999" />
              <YAxis stroke="#999999" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333333', color: '#ffffff' }}
                formatter={(value) => `${value}€`}
              />
              <Bar dataKey="value" fill="#ffffff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income by member */}
        <div className="budget-card">
          <h2 className="budget-card-header">Revenus par membre</h2>
          <div className="space-y-4">
            {Object.entries(memberIncome).map(([member, amount]) => (
              <div key={member} className="budget-stat">
                <span className="budget-stat-label">{member}</span>
                <span className="budget-stat-value">{amount.toLocaleString('fr-FR')} €</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income details */}
      <div className="budget-card">
        <h2 className="budget-card-header">Détails des revenus</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Membre</th>
                <th className="text-left py-3 px-4 text-[#999999] text-sm font-medium">Source</th>
                <th className="text-right py-3 px-4 text-[#999999] text-sm font-medium">Montant</th>
                <th className="text-right py-3 px-4 text-[#999999] text-sm font-medium">Date</th>
                <th className="text-right py-3 px-4 text-[#999999] text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map(income => (
                <tr key={income.id} className="border-b border-[#333333] hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-3 px-4 text-white">{income.member}</td>
                  <td className="py-3 px-4 text-[#999999]">{income.source}</td>
                  <td className="py-3 px-4 text-right text-white font-semibold">
                    {income.amount.toLocaleString('fr-FR')} €
                  </td>
                  <td className="py-3 px-4 text-right text-[#999999] text-sm">
                    {new Date(income.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditClick(income.id)}
                      className="p-2 hover:bg-[#333333] rounded transition-colors"
                      title="Éditer"
                    >
                      <Edit2 size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(income.id)}
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
      <IncomeModal
        isOpen={isModalOpen}
        income={editingId ? incomeData.find((i) => i.id === editingId) : undefined}
        onSubmit={handleAddIncome}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        title="Supprimer le revenu"
        message="Êtes-vous sûr de vouloir supprimer ce revenu ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          if (deleteConfirm) deleteIncome(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Vider tous les revenus"
        message="Êtes-vous sûr de vouloir supprimer tous les revenus ? Cette action ne peut pas être annulée."
        confirmText="Vider"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          clearIncomes();
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
