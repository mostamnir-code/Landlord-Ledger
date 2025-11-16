export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const IncomeCategories = ['Rent', 'Late Fees', 'Utilities Reimbursement', 'Other'] as const;
export const ExpenseCategories = ['Repairs', 'Utilities', 'Mortgage', 'Property Tax', 'Insurance', 'Supplies', 'HOA Fees', 'Management Fees', 'Other'] as const;

export interface Property {
  id: string;
  address: string;
  tenant: string;
  rent: number;
  lease_end: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  property_id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_id: string;
  notes?: string;
}
