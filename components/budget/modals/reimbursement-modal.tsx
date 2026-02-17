import { useState } from 'react';
import { Reimbursement } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReimbursementModalProps {
  isOpen: boolean;
  reimbursement?: Reimbursement;
  onSubmit: (data: Omit<Reimbursement, 'id'>) => void;
  onClose: () => void;
}

export function ReimbursementModal({ isOpen, reimbursement, onSubmit, onClose }: ReimbursementModalProps) {
  const [formData, setFormData] = useState(
    reimbursement || {
      from: '',
      to: '',
      amount: 0,
      reason: '',
      date: new Date().toISOString().split('T')[0],
      status: 'En attente',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.amount > 0 && formData.reason && formData.date) {
      onSubmit({
        from: formData.from,
        to: formData.to,
        amount: formData.amount,
        reason: formData.reason,
        date: formData.date,
        status: formData.status,
      });
      setFormData({
        from: '',
        to: '',
        amount: 0,
        reason: '',
        date: new Date().toISOString().split('T')[0],
        status: 'En attente',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="budget-card max-w-md w-full mx-4">
        <h2 className="budget-card-header">{reimbursement ? 'Modifier le remboursement' : 'Ajouter un remboursement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#999999] text-sm mb-2">De (qui doit)</label>
            <Select
              value={formData.from}
              onValueChange={(value) => setFormData({ ...formData, from: value })}
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
            <label className="block text-[#999999] text-sm mb-2">À (qui reçoit)</label>
            <Select
              value={formData.to}
              onValueChange={(value) => setFormData({ ...formData, to: value })}
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
            <label className="block text-[#999999] text-sm mb-2">Raison</label>
            <input
              type="text"
              placeholder="Ex: Essence partagée"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
            <label className="block text-[#999999] text-sm mb-2">Statut</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="w-full bg-[#0f0f0f] border border-[#333333] text-white">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="budget-button-secondary">
              Annuler
            </button>
            <button type="submit" className="budget-button">
              {reimbursement ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
