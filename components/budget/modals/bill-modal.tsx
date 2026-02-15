import { useState } from 'react';
import { Bill } from '@/lib/data';

interface BillModalProps {
  isOpen: boolean;
  bill?: Bill;
  onSubmit: (data: Omit<Bill, 'id'>) => void;
  onClose: () => void;
}

export function BillModal({ isOpen, bill, onSubmit, onClose }: BillModalProps) {
  const [formData, setFormData] = useState(
    bill || {
      name: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'En attente',
      assignedTo: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.amount > 0 && formData.dueDate && formData.assignedTo) {
      onSubmit({
        name: formData.name,
        amount: formData.amount,
        dueDate: formData.dueDate,
        status: formData.status,
        assignedTo: formData.assignedTo,
      });
      setFormData({
        name: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'En attente',
        assignedTo: '',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="budget-card max-w-md w-full mx-4">
        <h2 className="budget-card-header">{bill ? 'Modifier la facture' : 'Ajouter une facture'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#999999] text-sm mb-2">Nom de la facture</label>
            <input
              type="text"
              placeholder="Ex: Électricité"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Montant</label>
            <input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Date limite</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Assigné à</label>
            <input
              type="text"
              placeholder="Ex: Jean"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white"
            >
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
              <option value="En retard">En retard</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="budget-button-secondary">
              Annuler
            </button>
            <button type="submit" className="budget-button">
              {bill ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
