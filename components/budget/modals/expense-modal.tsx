import { useState } from 'react';
import { Expense } from '@/lib/data';

interface ExpenseModalProps {
  isOpen: boolean;
  expense?: Expense;
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onClose: () => void;
}

export function ExpenseModal({ isOpen, expense, onSubmit, onClose }: ExpenseModalProps) {
  const [formData, setFormData] = useState(
    expense || {
      member: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.member && formData.description && formData.amount > 0 && formData.date && formData.category) {
      onSubmit({
        member: formData.member,
        description: formData.description,
        amount: formData.amount,
        date: formData.date,
        category: formData.category,
      });
      setFormData({
        member: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="budget-card max-w-md w-full mx-4">
        <h2 className="budget-card-header">{expense ? 'Modifier la dépense' : 'Ajouter une dépense'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#999999] text-sm mb-2">Membre</label>
            <input
              type="text"
              placeholder="Ex: Jean"
              value={formData.member}
              onChange={(e) => setFormData({ ...formData, member: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Description</label>
            <input
              type="text"
              placeholder="Ex: Épicerie"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <label className="block text-[#999999] text-sm mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Catégorie</label>
            <input
              type="text"
              placeholder="Ex: Alimentation"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="budget-button-secondary">
              Annuler
            </button>
            <button type="submit" className="budget-button">
              {expense ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
