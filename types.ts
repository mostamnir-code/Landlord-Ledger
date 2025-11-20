
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const DefaultIncomeCategories = ['Rent', 'Late Fees', 'Utilities Reimbursement', 'Security Deposit', 'Parking Fees', 'Other'] as const;
export const DefaultExpenseCategories = ['Repairs', 'Maintenance', 'Utilities', 'Mortgage', 'Property Tax', 'Insurance', 'Supplies', 'HOA Fees', 'Management Fees', 'Advertising', 'Legal Fees', 'Landscaping', 'Travel', 'Other'] as const;

export const DocumentTypes = ['Lease Agreement', 'Receipt', 'Insurance Policy', 'Notice', 'Photo', 'Other'] as const;

export interface Property {
  id: string;
  address: string;
  type: 'SINGLE_FAMILY' | 'MULTI_UNIT';
  notes?: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  rent?: number; // Optional
  lease_end?: string; // Optional
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

export interface Reminder {
  id: string;
  tenant_id: string;
  enabled: boolean;
  due_date_reminder_days: number;
  late_fee_reminder_days: number;
  late_fee_amount: number;
}

export interface Document {
  id: string;
  created_at: string;
  property_id: string | null;
  unit_id: string | null;
  tenant_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  document_type: string;
  description: string | null;
}

export interface PaymentSettings {
  stripe_connected: boolean;
}

export interface BankConnection {
  id: string; // Unique ID for the connection in our system
  provider: 'plaid' | 'saltedge';
  institution_name: string;
  access_token?: string; // Plaid specific
  connection_id?: string; // Salt Edge specific
}

export interface SyncedTransaction {
  id: string; // A temporary ID for the UI
  date: string;
  description: string;
  amount: number;
  is_debit: boolean; // true for expenses, false for income
}

export interface RecurringTransaction {
  id: string;
  property_id: string;
  unit_id: string | null;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
}
