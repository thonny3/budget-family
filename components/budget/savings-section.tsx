'use client';

import { useState } from 'react';
import { useBudget } from '@/lib/budget-context';
import { PiggyBank, Plus, Edit2, Trash2 } from 'lucide-react';
import { SavingModal } from './modals/saving-modal';
import { ConfirmationModal } from './modals/confirmation-modal';

export default function SavingsSection() {
  const { data, addSaving, updateSaving, deleteSaving, clearSavings } = useBudget();
  const savingsData = data.savings;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleAddSaving = (saving: any) => {
    if (editingId) {
      updateSaving(editingId, saving);
      setEditingId(null);
    } else {
      addSaving(saving);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const totalTarget = savingsData.reduce((sum, s) => sum + s.targetAmount, 0);
  const totalSaved = savingsData.reduce((sum, s) => sum + s.currentAmount, 0);
  const averageProgress = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <PiggyBank size={32} />
            Épargne
          </h1>
          <p className="text-[#999999]">Suivi des objectifs d'épargne familiale</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="budget-button flex items-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
          {savingsData.length > 0 && (
            <button onClick={() => setClearConfirm(true)} className="budget-button-secondary">
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Overall progress */}
      <div className="budget-card">
        <p className="budget-stat-label mb-4">Épargne totale</p>
        <p className="text-4xl font-bold text-white mb-4">
          {totalSaved.toLocaleString('fr-FR')} / {totalTarget.toLocaleString('fr-FR')} €
        </p>
        <div className="w-full bg-[#333333] rounded-full h-4 overflow-hidden">
          <div
            className="bg-white h-4 rounded-full transition-all"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p className="text-[#999999] text-sm mt-3">{averageProgress}% d'objectif atteint</p>
      </div>

      {/* Savings goals */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Objectifs d'épargne</h2>
        {savingsData.map(saving => {
          const progress = Math.round((saving.currentAmount / saving.targetAmount) * 100);
          const remaining = saving.targetAmount - saving.currentAmount;
          const daysLeft = Math.ceil(
            (new Date(saving.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={saving.id}
              className="budget-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{saving.goal}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {saving.currentAmount.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-sm text-[#999999]">
                      {remaining.toLocaleString('fr-FR')} € à épargner
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(saving.id)}
                      className="p-2 hover:bg-[#333333] rounded transition-colors"
                      title="Éditer"
                    >
                      <Edit2 size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(saving.id)}
                      className="p-2 hover:bg-red-600/20 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#999999] text-sm">
                    Objectif: {saving.targetAmount.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-white font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-[#333333] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666666]">
                  Échéance: {new Date(saving.deadline).toLocaleDateString('fr-FR')}
                </span>
                <span className={`font-medium ${daysLeft > 0 ? 'text-[#999999]' : 'text-[#f87171]'}`}>
                  {daysLeft > 0 ? `${daysLeft} jours` : 'Dépassé'}
                </span>
              </div>
            </div>
          );
        })}
      </div>



      {/* Savings statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="budget-card">
          <p className="budget-stat-label mb-2">Nombre d'objectifs</p>
          <p className="text-3xl font-bold text-white">{savingsData.length}</p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Montant moyen épargné</p>
          <p className="text-3xl font-bold text-white">
            {Math.round(totalSaved / savingsData.length).toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Montant à atteindre</p>
          <p className="text-3xl font-bold text-white">
            {(totalTarget - totalSaved).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Modals */}
      <SavingModal
        isOpen={isModalOpen}
        saving={editingId ? savingsData.find((s) => s.id === editingId) : undefined}
        onSubmit={handleAddSaving}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        title="Supprimer l'épargne"
        message="Êtes-vous sûr de vouloir supprimer cet objectif d'épargne ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          if (deleteConfirm) deleteSaving(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Vider tous les objectifs d'épargne"
        message="Êtes-vous sûr de vouloir supprimer tous les objectifs d'épargne ? Cette action ne peut pas être annulée."
        confirmText="Vider"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          clearSavings();
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
