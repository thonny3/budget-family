import { useState } from 'react';
import { Saving } from '@/lib/data';

interface SavingModalProps {
  isOpen: boolean;
  saving?: Saving;
  onSubmit: (data: Omit<Saving, 'id' | 'percentage'>) => void;
  onClose: () => void;
}

export function SavingModal({ isOpen, saving, onSubmit, onClose }: SavingModalProps) {
  const [formData, setFormData] = useState(
    saving
      ? {
          goal: saving.goal,
          targetAmount: saving.targetAmount,
          currentAmount: saving.currentAmount,
          deadline: saving.deadline,
        }
      : {
          goal: '',
          targetAmount: 0,
          currentAmount: 0,
          deadline: new Date().toISOString().split('T')[0],
        }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.goal && formData.targetAmount > 0 && formData.currentAmount >= 0 && formData.deadline) {
      onSubmit({
        goal: formData.goal,
        targetAmount: formData.targetAmount,
        currentAmount: formData.currentAmount,
        deadline: formData.deadline,
      });
      setFormData({
        goal: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0],
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="budget-card max-w-md w-full mx-4">
        <h2 className="budget-card-header">{saving ? 'Modifier l\'épargne' : 'Ajouter un objectif d\'épargne'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#999999] text-sm mb-2">Objectif</label>
            <input
              type="text"
              placeholder="Ex: Vacances"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Montant cible</label>
            <input
              type="number"
              placeholder="0"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Montant actuel</label>
            <input
              type="number"
              placeholder="0"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Date limite</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-[#666666]"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="budget-button-secondary">
              Annuler
            </button>
            <button type="submit" className="budget-button">
              {saving ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
