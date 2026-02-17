// Types
export interface Income {
  id: string;
  member: string;
  source: string;
  amount: number;
  date: string;
  category: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  member: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: string;
  assignedTo: string;
}

export interface Reimbursement {
  id: string;
  from: string;
  to: string;
  amount: number;
  reason: string;
  date: string;
  status: string;
}

export interface Saving {
  id: string;
  goal: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  percentage: number;
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  member: string;
  status: string;
}

export interface BudgetData {
  incomes: Income[];
  expenses: Expense[];
  bills: Bill[];
  reimbursements: Reimbursement[];
  savings: Saving[];
  transactions: Transaction[];
}

export const EXPENSE_CATEGORIES = [
  'Alimentation',
  'Transport',
  'Logement',
  'Factures',
  'Santé',
  'Éducation',
  'Vêtements',
  'Divertissement',
  'Technologie',
  'Maison',
  'Vacances',
  'Autres'
];

export const INCOME_CATEGORIES = [
  'Salaire',
  'Prime',
  'Freelance',
  'Investissement',
  'Cadeau',
  'Allocations',
  'Remboursement',
  'Vente',
  'Autres'
];

// Static Data
export const incomeData: Income[] = [
  { id: '1', member: 'Jean', source: 'Salaire', amount: 3500, date: '2024-02-01', category: 'Emploi' },
  { id: '2', member: 'Marie', source: 'Salaire', amount: 3200, date: '2024-02-01', category: 'Emploi' },
  { id: '3', member: 'Jean', source: 'Freelance', amount: 800, date: '2024-02-10', category: 'Autre revenu' },
];

export const expenseData: Expense[] = [
  { id: '1', category: 'Alimentation', description: 'Courses supermarché', amount: 250, date: '2024-02-10', member: 'Marie' },
  { id: '2', category: 'Transport', description: 'Essence', amount: 60, date: '2024-02-12', member: 'Jean' },
  { id: '3', category: 'Divertissement', description: 'Cinéma', amount: 30, date: '2024-02-14', member: 'Jean' },
  { id: '4', category: 'Alimentation', description: 'Restaurant', amount: 85, date: '2024-02-13', member: 'Marie' },
  { id: '5', category: 'Vêtements', description: 'Achats de vêtements', amount: 150, date: '2024-02-11', member: 'Marie' },
  { id: '6', category: 'Santé', description: 'Pharmacie', amount: 45, date: '2024-02-09', member: 'Jean' },
];

export const billsData: Bill[] = [
  { id: '1', name: 'Électricité', amount: 180, dueDate: '2024-02-15', status: 'Payée', assignedTo: 'Jean' },
  { id: '2', name: 'Internet', amount: 50, dueDate: '2024-02-15', status: 'En attente', assignedTo: 'Jean' },
  { id: '3', name: 'Assurance habitation', amount: 120, dueDate: '2024-02-20', status: 'Payée', assignedTo: 'Marie' },
];

export const reimbursementData: Reimbursement[] = [
  { id: '1', from: 'Jean', to: 'Marie', amount: 150, reason: 'Essence partagée', date: '2024-02-05', status: 'Validé' },
  { id: '2', from: 'Marie', to: 'Jean', amount: 75, reason: 'Épicerie', date: '2024-02-06', status: 'En attente' },
];

export const savingsData: Saving[] = [
  { id: '1', goal: 'Vacances', targetAmount: 5000, currentAmount: 1200, deadline: '2024-06-30', percentage: 24 },
  { id: '2', goal: 'Rénovation cuisine', targetAmount: 10000, currentAmount: 3500, deadline: '2024-12-31', percentage: 35 },
  { id: '3', goal: 'Fonds d\'urgence', targetAmount: 8000, currentAmount: 5600, deadline: '2024-12-31', percentage: 70 },
];

export const transactionsData: Transaction[] = [
  { id: '1', type: 'income', description: 'Salaire Jean', amount: 3500, date: '2024-02-01', category: 'Salaire', member: 'Jean', status: 'completed' },
  { id: '2', type: 'income', description: 'Salaire Marie', amount: 3200, date: '2024-02-01', category: 'Salaire', member: 'Marie', status: 'completed' },
  { id: '3', type: 'bill', description: 'Paiement Loyer', amount: 1200, date: '2024-02-01', category: 'Logement', member: 'Admin', status: 'paid' },
  { id: '4', type: 'expense', description: 'Courses supermarché', amount: 250, date: '2024-02-10', category: 'Alimentation', member: 'Marie', status: 'completed' },
  { id: '5', type: 'expense', description: 'Essence', amount: 60, date: '2024-02-12', category: 'Transport', member: 'Jean', status: 'completed' },
  { id: '6', type: 'reimbursement', description: 'Remboursement courses', amount: 50, date: '2024-02-12', category: 'Remboursement', member: 'Jean', status: 'pending' },
  { id: '7', type: 'expense', description: 'Restaurant', amount: 85, date: '2024-02-13', category: 'Alimentation', member: 'Marie', status: 'completed' },
  { id: '8', type: 'saving', description: 'Épargne vacances', amount: 500, date: '2024-02-14', category: 'Vacances', member: 'Admin', status: 'saved' },
  { id: '9', type: 'expense', description: 'Cinéma', amount: 30, date: '2024-02-14', category: 'Divertissement', member: 'Jean', status: 'completed' },
  { id: '10', type: 'expense', description: 'Achats vêtements', amount: 150, date: '2024-02-11', category: 'Vêtements', member: 'Marie', status: 'completed' },
];

// Summary calculations
export const calculateTotals = (data?: {
  incomes: Income[],
  expenses: Expense[],
  bills: Bill[],
  savings: Saving[]
}) => {
  const incomes = data?.incomes || incomeData;
  const expenses = data?.expenses || expenseData;
  const bills = data?.bills || billsData;
  const savings = data?.savings || savingsData;

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalSavings = savings.reduce((sum, saving) => sum + saving.currentAmount, 0);

  return {
    income: totalIncome,
    expenses: totalExpenses,
    bills: totalBills,
    savings: totalSavings,
    balance: totalIncome - totalExpenses - totalBills,
  };
};

// Expense categories for charts
export const getExpensesByCategory = (expenses?: Expense[]) => {
  const data = expenses || expenseData;
  const categories: { [key: string]: number } = {};
  data.forEach(expense => {
    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
  });
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

// Income by source
export const getIncomeBySource = (incomes?: Income[]) => {
  const data = incomes || incomeData;
  const sources: { [key: string]: number } = {};
  data.forEach(income => {
    sources[income.source] = (sources[income.source] || 0) + income.amount;
  });
  return Object.entries(sources).map(([name, value]) => ({ name, value }));
};

// Bills by status
export const getBillsByStatus = (bills?: Bill[]) => {
  const data = bills || billsData;
  const statuses = {
    paid: data.filter(b => b.status === 'Payée').length,
    pending: data.filter(b => b.status === 'En attente').length,
    overdue: data.filter(b => b.status === 'En retard').length,
  };
  return statuses;
};
