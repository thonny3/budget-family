'use client';

import { useState } from 'react';
import { useBudget } from '@/lib/budget-context';
import { RefreshCw, Plus, Edit2, Trash2 } from 'lucide-react';
import { ReimbursementModal } from './modals/reimbursement-modal';
import { ConfirmationModal } from './modals/confirmation-modal';

export default function ReimbursementSection() {
  const { data, addReimbursement, updateReimbursement, deleteReimbursement, clearReimbursements } = useBudget();
  const reimbursementData = data.reimbursements;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleAddReimbursement = (reimbursement: any) => {
    if (editingId) {
      updateReimbursement(editingId, reimbursement);
      setEditingId(null);
    } else {
      addReimbursement(reimbursement);
    }
    setIsModalOpen(false);
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const totalReimbursements = reimbursementData.reduce((sum, r) => sum + r.amount, 0);
  const pendingReimbursements = reimbursementData.filter(r => r.status === 'En attente');
  const validatedReimbursements = reimbursementData.filter(r => r.status === 'Validé');

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'budget-tag budget-tag-warning';
      case 'Validé':
        return 'budget-tag budget-tag-success';
      case 'Rejeté':
        return 'budget-tag budget-tag-danger';
      default:
        return 'budget-tag';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <RefreshCw size={32} />
            Remboursements
          </h1>
          <p className="text-[#999999]">Gestion des remboursements entre membres de la famille</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="budget-button flex items-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
          {reimbursementData.length > 0 && (
            <button onClick={() => setClearConfirm(true)} className="budget-button-secondary">
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="budget-card">
          <p className="budget-stat-label mb-2">Total remboursements</p>
          <p className="text-3xl font-bold text-white">{totalReimbursements.toLocaleString('fr-FR')} €</p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">En attente</p>
          <p className="text-3xl font-bold text-white">{pendingReimbursements.length}</p>
          <p className="text-sm text-[#999999] mt-2">
            {(pendingReimbursements.reduce((sum, r) => sum + r.amount, 0)).toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Validés</p>
          <p className="text-3xl font-bold text-white">{validatedReimbursements.length}</p>
          <p className="text-sm text-[#999999] mt-2">
            {(validatedReimbursements.reduce((sum, r) => sum + r.amount, 0)).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Reimbursements list */}
      <div className="budget-card">
        <h2 className="budget-card-header">Liste des remboursements</h2>
        <div className="space-y-4">
          {reimbursementData.map(reimbursement => (
            <div
              key={reimbursement.id}
              className="flex items-start justify-between p-4 bg-[#0f0f0f] rounded-lg border border-[#333333] hover:border-[#555555] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-lg">
                    {reimbursement.from} → {reimbursement.to}
                  </h3>
                  <span className={getStatusTag(reimbursement.status)}>
                    {reimbursement.status}
                  </span>
                </div>
                <p className="text-[#999999] mb-2">{reimbursement.reason}</p>
                <p className="text-sm text-[#666666]">
                  {new Date(reimbursement.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {reimbursement.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(reimbursement.id)}
                    className="p-2 hover:bg-[#333333] rounded transition-colors"
                    title="Éditer"
                  >
                    <Edit2 size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(reimbursement.id)}
                    className="p-2 hover:bg-red-600/20 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary by member */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="budget-card">
          <h2 className="budget-card-header">Remboursements à recevoir</h2>
          <div className="space-y-3">
            {Array.from(new Set(reimbursementData.map(r => r.to))).map(member => {
              const owed = reimbursementData
                .filter(r => r.to === member)
                .reduce((sum, r) => sum + r.amount, 0);
              return (
                <div key={member} className="budget-stat">
                  <span className="budget-stat-label">{member} doit recevoir</span>
                  <span className="budget-stat-value text-[#4ade80]">{owed.toLocaleString('fr-FR')} €</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="budget-card">
          <h2 className="budget-card-header">Remboursements à faire</h2>
          <div className="space-y-3">
            {Array.from(new Set(reimbursementData.map(r => r.from))).map(member => {
              const owes = reimbursementData
                .filter(r => r.from === member)
                .reduce((sum, r) => sum + r.amount, 0);
              return (
                <div key={member} className="budget-stat">
                  <span className="budget-stat-label">{member} doit payer</span>
                  <span className="budget-stat-value text-[#f87171]">{owes.toLocaleString('fr-FR')} €</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReimbursementModal
        isOpen={isModalOpen}
        reimbursement={editingId ? reimbursementData.find((r) => r.id === editingId) : undefined}
        onSubmit={handleAddReimbursement}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        title="Supprimer le remboursement"
        message="Êtes-vous sûr de vouloir supprimer ce remboursement ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          if (deleteConfirm) deleteReimbursement(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Vider tous les remboursements"
        message="Êtes-vous sûr de vouloir supprimer tous les remboursements ? Cette action ne peut pas être annulée."
        confirmText="Vider"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          clearReimbursements();
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
