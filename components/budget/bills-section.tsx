'use client';

import { useState } from 'react';
import { useBudget } from '@/lib/budget-context';

import { FileText, AlertCircle, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { BillModal } from './modals/bill-modal';
import { ConfirmationModal } from './modals/confirmation-modal';

export default function BillsSection() {
  const { data, addBill, updateBill, deleteBill, clearBills } = useBudget();
  const billsData = data.bills;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleAddBill = (bill: any) => {
    if (editingId) {
      updateBill(editingId, bill);
      setEditingId(null);
    } else {
      addBill(bill);
    }
    setIsModalOpen(false);
  };


  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    const bill = billsData.find(b => b.id === id);
    if (bill) {
      updateBill(id, { ...bill, status: 'Payée' });
    }
  };

  const totalBills = billsData.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = billsData.filter(b => b.status === 'Payée');
  const pendingBills = billsData.filter(b => b.status === 'En attente');
  const overdueBills = billsData.filter(b => b.status === 'En retard');

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Payée':
        return 'budget-tag budget-tag-success';
      case 'En attente':
        return 'budget-tag budget-tag-warning';
      case 'En retard':
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
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <FileText size={32} />
            Factures & Maison
          </h1>
          <p className="text-muted-foreground">Gestion des factures et dépenses de la maison</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="budget-button flex items-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
          {billsData.length > 0 && (
            <button onClick={() => setClearConfirm(true)} className="budget-button-secondary">
              Vider
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="budget-card">
          <p className="budget-stat-label mb-2">Total factures</p>
          <p className="text-3xl font-bold text-foreground">{totalBills.toLocaleString('fr-FR')} Ar</p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">Factures payées</p>
          <p className="text-3xl font-bold text-foreground">{paidBills.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {(paidBills.reduce((sum, b) => sum + b.amount, 0)).toLocaleString('fr-FR')} Ar
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">En attente</p>
          <p className="text-3xl font-bold text-foreground">{pendingBills.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {(pendingBills.reduce((sum, b) => sum + b.amount, 0)).toLocaleString('fr-FR')} Ar
          </p>
        </div>

        <div className="budget-card">
          <p className="budget-stat-label mb-2">En retard</p>
          <p className="text-3xl font-bold text-foreground">{overdueBills.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {(overdueBills.reduce((sum, b) => sum + b.amount, 0)).toLocaleString('fr-FR')} Ar
          </p>
        </div>
      </div>

      {/* Bills list */}
      <div className="budget-card">
        <h2 className="budget-card-header">Liste complète des factures</h2>
        <div className="space-y-4">
          {billsData.map(bill => (
            <div
              key={bill.id}
              className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-foreground font-semibold text-lg">{bill.name}</h3>
                  <span className={getStatusTag(bill.status)}>
                    {bill.status}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="opacity-70">Assigné à: </span>
                    <span className="text-foreground">{bill.assignedTo}</span>
                  </div>
                  <div>
                    <span className="opacity-70">Échéance: </span>
                    <span className="text-foreground">{new Date(bill.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground mb-2">
                    {bill.amount.toLocaleString('fr-FR')} Ar
                  </p>
                </div>

                <div className="flex gap-2">
                  {bill.status !== 'Payée' && (
                    <button
                      onClick={() => handleMarkAsPaid(bill.id)}
                      className="p-2 hover:bg-green-600/20 rounded transition-colors"
                      title="Marquer comme payée"
                    >
                      <CheckCircle size={16} className="text-green-500" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(bill.id)}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Éditer"
                  >
                    <Edit2 size={16} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(bill.id)}
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

      {/* Alerts and modals section */}
      {overdueBills.length > 0 && (
        <div className="budget-card border-destructive/50">
          <h2 className="budget-card-header flex items-center gap-2 text-destructive">
            <AlertCircle size={24} />
            Factures en retard
          </h2>
          <div className="space-y-3">
            {overdueBills.map(bill => (
              <div key={bill.id} className="budget-stat">
                <span className="budget-stat-label">{bill.name}</span>
                <span className="text-destructive font-semibold">{bill.amount.toLocaleString('fr-FR')} Ar</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <BillModal
        isOpen={isModalOpen}
        bill={editingId ? billsData.find((b) => b.id === editingId) : undefined}
        onSubmit={handleAddBill}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmationModal
        isOpen={deleteConfirm !== null}
        title="Supprimer la facture"
        message="Êtes-vous sûr de vouloir supprimer cette facture ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          if (deleteConfirm) deleteBill(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmationModal
        isOpen={clearConfirm}
        title="Vider toutes les factures"
        message="Êtes-vous sûr de vouloir supprimer toutes les factures ? Cette action ne peut pas être annulée."
        confirmText="Vider"
        cancelText="Annuler"
        isDangerous
        onConfirm={() => {
          clearBills();
          setClearConfirm(false);
        }}
        onCancel={() => setClearConfirm(false)}
      />
    </div>
  );
}
