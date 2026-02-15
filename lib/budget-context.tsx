'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Income, Expense, Bill, Reimbursement, Saving, Transaction, BudgetData } from './data';

interface BudgetContextType {
  data: BudgetData;
  addIncome: (income: Omit<Income, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  addReimbursement: (reimbursement: Omit<Reimbursement, 'id'>) => void;
  addSaving: (saving: Omit<Saving, 'id'>) => void;
  updateIncome: (id: string, income: Omit<Income, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  updateBill: (id: string, bill: Omit<Bill, 'id'>) => void;
  updateReimbursement: (id: string, reimbursement: Omit<Reimbursement, 'id'>) => void;
  updateSaving: (id: string, saving: Omit<Saving, 'id'>) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteBill: (id: string) => void;
  deleteReimbursement: (id: string) => void;
  deleteSaving: (id: string) => void;
  clearIncomes: () => void;
  clearExpenses: () => void;
  clearBills: () => void;
  clearReimbursements: () => void;
  clearSavings: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BudgetData>({
    incomes: [
      { id: '1', member: 'Jean', source: 'Salaire', amount: 3500, date: '2024-02-01', category: 'Emploi' },
      { id: '2', member: 'Marie', source: 'Salaire', amount: 3200, date: '2024-02-01', category: 'Emploi' },
      { id: '3', member: 'Jean', source: 'Freelance', amount: 800, date: '2024-02-10', category: 'Autre revenu' },
    ],
    expenses: [
      { id: '1', member: 'Famille', description: 'Épicerie', amount: 250, date: '2024-02-03', category: 'Alimentation' },
      { id: '2', member: 'Jean', description: 'Essence', amount: 60, date: '2024-02-05', category: 'Transport' },
      { id: '3', member: 'Marie', description: 'Vêtements', amount: 120, date: '2024-02-08', category: 'Shopping' },
    ],
    bills: [
      { id: '1', name: 'Électricité', amount: 180, dueDate: '2024-02-15', status: 'Payée', assignedTo: 'Jean' },
      { id: '2', name: 'Internet', amount: 50, dueDate: '2024-02-15', status: 'En attente', assignedTo: 'Jean' },
      { id: '3', name: 'Assurance habitation', amount: 120, dueDate: '2024-02-20', status: 'Payée', assignedTo: 'Marie' },
    ],
    reimbursements: [
      { id: '1', from: 'Jean', to: 'Marie', amount: 150, reason: 'Essence partagée', date: '2024-02-05', status: 'Validé' },
      { id: '2', from: 'Marie', to: 'Jean', amount: 75, reason: 'Épicerie', date: '2024-02-06', status: 'En attente' },
    ],
    savings: [
      { id: '1', goal: 'Vacances', targetAmount: 5000, currentAmount: 1200, deadline: '2024-06-30', percentage: 24 },
      { id: '2', goal: 'Rénovation cuisine', targetAmount: 10000, currentAmount: 3500, deadline: '2024-12-31', percentage: 35 },
      { id: '3', goal: 'Fonds d\'urgence', targetAmount: 8000, currentAmount: 5600, deadline: '2024-12-31', percentage: 70 },
    ],
    transactions: [],
  });

  const generateTransactions = () => {
    const transactions: Transaction[] = [];
    data.incomes.forEach((income) => {
      transactions.push({
        id: `inc-${income.id}`,
        type: 'Revenu',
        description: `${income.source} - ${income.member}`,
        amount: income.amount,
        date: income.date,
        category: income.category,
      });
    });
    data.expenses.forEach((expense) => {
      transactions.push({
        id: `exp-${expense.id}`,
        type: 'Dépense',
        description: `${expense.description} - ${expense.member}`,
        amount: -expense.amount,
        date: expense.date,
        category: expense.category,
      });
    });
    data.bills.forEach((bill) => {
      transactions.push({
        id: `bill-${bill.id}`,
        type: 'Facture',
        description: bill.name,
        amount: -bill.amount,
        date: bill.dueDate,
        category: 'Factures',
      });
    });
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setData((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: newId }],
    }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: newId }],
    }));
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setData((prev) => ({
      ...prev,
      bills: [...prev.bills, { ...bill, id: newId }],
    }));
  };

  const addReimbursement = (reimbursement: Omit<Reimbursement, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setData((prev) => ({
      ...prev,
      reimbursements: [...prev.reimbursements, { ...reimbursement, id: newId }],
    }));
  };

  const addSaving = (saving: Omit<Saving, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const percentage = Math.round((saving.currentAmount / saving.targetAmount) * 100);
    setData((prev) => ({
      ...prev,
      savings: [...prev.savings, { ...saving, id: newId, percentage }],
    }));
  };

  const updateIncome = (id: string, income: Omit<Income, 'id'>) => {
    setData((prev) => ({
      ...prev,
      incomes: prev.incomes.map((item) => (item.id === id ? { ...item, ...income } : item)),
    }));
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) => (item.id === id ? { ...item, ...expense } : item)),
    }));
  };

  const updateBill = (id: string, bill: Omit<Bill, 'id'>) => {
    setData((prev) => ({
      ...prev,
      bills: prev.bills.map((item) => (item.id === id ? { ...item, ...bill } : item)),
    }));
  };

  const updateReimbursement = (id: string, reimbursement: Omit<Reimbursement, 'id'>) => {
    setData((prev) => ({
      ...prev,
      reimbursements: prev.reimbursements.map((item) => (item.id === id ? { ...item, ...reimbursement } : item)),
    }));
  };

  const updateSaving = (id: string, saving: Omit<Saving, 'id'>) => {
    const percentage = Math.round((saving.currentAmount / saving.targetAmount) * 100);
    setData((prev) => ({
      ...prev,
      savings: prev.savings.map((item) => (item.id === id ? { ...item, ...saving, percentage } : item)),
    }));
  };

  const deleteIncome = (id: string) => {
    setData((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((item) => item.id !== id),
    }));
  };

  const deleteExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== id),
    }));
  };

  const deleteBill = (id: string) => {
    setData((prev) => ({
      ...prev,
      bills: prev.bills.filter((item) => item.id !== id),
    }));
  };

  const deleteReimbursement = (id: string) => {
    setData((prev) => ({
      ...prev,
      reimbursements: prev.reimbursements.filter((item) => item.id !== id),
    }));
  };

  const deleteSaving = (id: string) => {
    setData((prev) => ({
      ...prev,
      savings: prev.savings.filter((item) => item.id !== id),
    }));
  };

  const clearIncomes = () => {
    setData((prev) => ({ ...prev, incomes: [] }));
  };

  const clearExpenses = () => {
    setData((prev) => ({ ...prev, expenses: [] }));
  };

  const clearBills = () => {
    setData((prev) => ({ ...prev, bills: [] }));
  };

  const clearReimbursements = () => {
    setData((prev) => ({ ...prev, reimbursements: [] }));
  };

  const clearSavings = () => {
    setData((prev) => ({ ...prev, savings: [] }));
  };

  return (
    <BudgetContext.Provider
      value={{
        data: { ...data, transactions: generateTransactions() },
        addIncome,
        addExpense,
        addBill,
        addReimbursement,
        addSaving,
        updateIncome,
        updateExpense,
        updateBill,
        updateReimbursement,
        updateSaving,
        deleteIncome,
        deleteExpense,
        deleteBill,
        deleteReimbursement,
        deleteSaving,
        clearIncomes,
        clearExpenses,
        clearBills,
        clearReimbursements,
        clearSavings,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
