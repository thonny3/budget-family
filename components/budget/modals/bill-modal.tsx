import { useState } from 'react';
import { Bill } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
            <label className="block text-[#999999] text-sm mb-2">Date limite</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#999999] text-sm mb-2">Assigné à</label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
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
            <label className="block text-[#999999] text-sm mb-2">Statut</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="w-full bg-[#0f0f0f] border border-[#333333] text-white">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payée">Payée</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En retard">En retard</SelectItem>
              </SelectContent>
            </Select>
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
