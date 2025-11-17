
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const DefaultIncomeCategories = ['Rent', 'Late Fees', 'Utilities Reimbursement', 'Security Deposit', 'Parking Fees', 'Other'] as const;
export const DefaultExpenseCategories = ['Repairs', 'Maintenance', 'Utilities', 'Mortgage', 'Property Tax', 'Insurance', 'Supplies', 'HOA Fees', 'Management Fees', 'Advertising', 'Legal Fees', 'Landscaping', 'Travel', 'Other'] as const;

export interface Property {
  id: string;
  address: string;
  notes?: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  rent: number;
  lease_end: string;
}

export interface Transaction {
  id: string;
  property_id: string;
  unit_id?: string | null;
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
  unit_id: string | null;
  notes?: string;
}
