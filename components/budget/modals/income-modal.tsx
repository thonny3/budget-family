import { useState } from 'react';
import { Income, INCOME_CATEGORIES } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IncomeModalProps {
  isOpen: boolean;
  income?: Income;
  onSubmit: (data: Omit<Income, 'id'>) => void;
  onClose: () => void;
}

export function IncomeModal({ isOpen, income, onSubmit, onClose }: IncomeModalProps) {
  const [formData, setFormData] = useState(
    income || {
      member: '',
      source: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.member && formData.source && formData.amount > 0 && formData.date && formData.category) {
      onSubmit({
        member: formData.member,
        source: formData.source,
        amount: formData.amount,
        date: formData.date,
        category: formData.category,
      });
      setFormData({
        member: '',
        source: '',
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
        <h2 className="budget-card-header">{income ? 'Modifier le revenu' : 'Ajouter un revenu'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#999999] text-sm mb-2">Membre</label>
            <Select
              value={formData.member}
              onValueChange={(value) => setFormData({ ...formData, member: value })}
            >
              <SelectTrigger className="w-full bg-[#0f0f0f] border border-[#333333] text-white">
                <SelectValue placeholder="Sélectionner un membre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jean">Jean</SelectItem>
                <SelectItem value="Marie">Marie</SelectItem>
                <SelectItem value="Enfants">Enfants</SelectItem>
                <SelectItem value="Famille">Famille</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Source</label>
            <input
              type="text"
              placeholder="Ex: Salaire"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Montant</label>
            <input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Catégorie</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="w-full bg-[#0f0f0f] border border-[#333333] text-white">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="budget-button-secondary">
              Annuler
            </button>
            <button type="submit" className="budget-button">
              {income ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
