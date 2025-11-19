import React, { useState, useMemo, useEffect } from 'react';
import type { Property, Transaction, Unit, RecurringTransaction } from '../types';
import { TransactionType, DefaultIncomeCategories, DefaultExpenseCategories } from '../types';
import { Modal } from './Modal';
import { ConfirmModal } from './ConfirmModal';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ClockCounterClockwiseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
);

const SortAscendingIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 5a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V6a1 1 0 011-1z" transform="rotate(180 10 10)" /></svg>
)
const SortDescendingIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 15a1 1 0 01-1-1V5.414l-2.293 2.293a1 1 0 11-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 11-1.414 1.414L11 5.414V14a1 1 0 01-1 1z" /></svg>
)

const EmptyTransactionsIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 10.5H63V73.5L56 66.5L49 73.5L42 66.5L35 73.5L28 66.5L21 73.5V10.5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M35 31.5H49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"/>
        <path d="M35 45.5H49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"/>
    </svg>
);

type SortKey = 'date' | 'property' | 'description' | 'category' | 'amount';

const categorySuggestions = [
    // Expenses
    { keywords: ['repair', 'fix', 'maintenance', 'plumbing', 'electrician', 'handyman'], category: 'Repairs', type: TransactionType.EXPENSE },
    { keywords: ['utility', 'electric', 'water', 'gas', 'internet', 'sewage', 'bill'], category: 'Utilities', type: TransactionType.EXPENSE },
    { keywords: ['mortgage', 'loan payment'], category: 'Mortgage', type: TransactionType.EXPENSE },
    { keywords: ['tax', 'property tax'], category: 'Property Tax', type: TransactionType.EXPENSE },
    { keywords: ['insurance', 'premium'], category: 'Insurance', type: TransactionType.EXPENSE },
    { keywords: ['supply', 'materials', 'paint', 'tools', 'home depot', 'lowes'], category: 'Supplies', type: TransactionType.EXPENSE },
    { keywords: ['hoa', 'homeowners association'], category: 'HOA Fees', type: TransactionType.EXPENSE },
    { keywords: ['management', 'manager fee'], category: 'Management Fees', type: TransactionType.EXPENSE },
    // Income
    { keywords: ['rent'], category: 'Rent', type: TransactionType.INCOME },
    { keywords: ['late fee', 'penalty'], category: 'Late Fees', type: TransactionType.INCOME },
    { keywords: ['reimbursement'], category: 'Utilities Reimbursement', type: TransactionType.INCOME },
];

const TransactionForm: React.FC<{ 
  onSave: (transaction: Omit<Transaction, 'id'>) => void; 
  onClose: () => void; 
  properties: Property[];
  units: Unit[];
  initialTransaction?: Transaction | null;
}> = ({ onSave, onClose, properties, units, initialTransaction }) => {
  const incomeCategories = useMemo(() => [...DefaultIncomeCategories].sort(), []);
  const expenseCategories = useMemo(() => [...DefaultExpenseCategories].sort(), []);
  
  const [propertyId, setPropertyId] = useState(initialTransaction?.property_id || properties[0]?.id || '');
  const [unitId, setUnitId] = useState<string | null>(initialTransaction?.unit_id || null);
  const [type, setType] = useState<TransactionType>(initialTransaction?.type || TransactionType.INCOME);
  const [category, setCategory] = useState<string>(initialTransaction?.category || incomeCategories[0] || '');
  const [description, setDescription] = useState(initialTransaction?.description || '');
  const [amount, setAmount] = useState(initialTransaction?.amount.toString() || '');
  const [date, setDate] = useState(initialTransaction?.date || new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableUnits = useMemo(() => units.filter(u => u.property_id === propertyId), [units, propertyId]);
  
  useEffect(() => {
    // Reset unit if property changes
    setUnitId(null);
  }, [propertyId]);

  useEffect(() => {
    if (initialTransaction && type === initialTransaction.type) {
        return;
    }

    if (type === TransactionType.INCOME) {
        setCategory(incomeCategories[0] || '');
    } else {
        setCategory(expenseCategories[0] || '');
    }
  }, [type, initialTransaction, incomeCategories, expenseCategories]);

  useEffect(() => {
    const lowercasedDescription = description.toLowerCase();
    if (!lowercasedDescription || (initialTransaction && description === initialTransaction.description)) return;

    for (const suggestion of categorySuggestions) {
        for (const keyword of suggestion.keywords) {
            if (lowercasedDescription.includes(keyword)) {
                if (type !== suggestion.type) {
                    setType(suggestion.type);
                }
                if (category !== suggestion.category) {
                    setCategory(suggestion.category);
                }
                return; 
            }
        }
    }
  }, [description, category, type, initialTransaction]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!propertyId) {
      newErrors.propertyId = 'A property must be selected.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number.';
    }
    if (!date) {
      newErrors.date = 'Date is required.';
    } else if (new Date(date) > new Date()) {
      newErrors.date = 'Date cannot be in the future.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({ property_id: propertyId, unit_id: unitId, type, category, description, amount: parseFloat(amount), date });
    onClose();
  };

  const currentCategories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Property</label>
                <select 
                id="propertyId" 
                value={propertyId} 
                onChange={(e) => setPropertyId(e.target.value)} 
                required 
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md ${errors.propertyId ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                >
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
                </select>
                {errors.propertyId && <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>}
            </div>
            <div>
                <label htmlFor="unitId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unit (Optional)</label>
                <select 
                id="unitId" 
                value={unitId ?? ''}
                onChange={(e) => setUnitId(e.target.value || null)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                disabled={availableUnits.length === 0}
                >
                <option value="">Property-wide</option>
                {availableUnits.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
                </select>
            </div>
       </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
          <option value={TransactionType.INCOME}>Income</option>
          <option value={TransactionType.EXPENSE}>Expense</option>
        </select>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <input 
          type="text" 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
            <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.amount ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
            <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.date ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{initialTransaction ? 'Save Changes' : 'Add Transaction'}</button>
      </div>
    </form>
  );
};

interface TransactionsViewProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transactionId: string) => void;
  updateTransaction: (transactionId: string, data: Omit<Transaction, 'id'>) => void;
  properties: Property[];
  units: Unit[];
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  updateRecurringTransaction: (id: string, data: Partial<Omit<RecurringTransaction, 'id'>>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
}

const RecurringTransactionForm: React.FC<{
    onSave: (data: Omit<RecurringTransaction, 'id'>) => void;
    onClose: () => void;
    properties: Property[];
    units: Unit[];
    initialData?: RecurringTransaction | null;
}> = ({ onSave, onClose, properties, units, initialData }) => {
    const [propertyId, setPropertyId] = useState(initialData?.property_id || properties[0]?.id || '');
    const [unitId, setUnitId] = useState<string | null>(initialData?.unit_id || null);
    const [type, setType] = useState<TransactionType>(initialData?.type || TransactionType.INCOME);
    const [category, setCategory] = useState(initialData?.category || DefaultIncomeCategories[0]);
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(initialData?.frequency || 'monthly');
    const [startDate, setStartDate] = useState(initialData?.start_date || new Date().toISOString().split('T')[0]);
    
    const availableUnits = useMemo(() => units.filter(u => u.property_id === propertyId), [units, propertyId]);
    const availableCategories = useMemo(() => type === TransactionType.INCOME ? DefaultIncomeCategories : DefaultExpenseCategories, [type]);

    useEffect(() => {
        setUnitId(initialData?.property_id === propertyId ? initialData?.unit_id : null);
    }, [propertyId, initialData]);

    useEffect(() => {
        if (!initialData || type !== initialData.type) {
            setCategory(availableCategories[0]);
        }
    }, [type, initialData, availableCategories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (!description || isNaN(parsedAmount) || parsedAmount <= 0 || !propertyId || !startDate) {
            alert("Please fill in all required fields with valid values.");
            return;
        }
        onSave({
            property_id: propertyId,
            unit_id: unitId,
            type,
            category,
            description,
            amount: parsedAmount,
            frequency,
            start_date: startDate,
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Property</label>
                    <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unit (Optional)</label>
                    <select value={unitId ?? ''} onChange={(e) => setUnitId(e.target.value || null)} disabled={!propertyId || availableUnits.length === 0} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-slate-50 dark:disabled:bg-slate-800">
                        <option value="">Property-wide</option>
                        {availableUnits.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as TransactionType)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value={TransactionType.INCOME}>Income</option>
                        <option value={TransactionType.EXPENSE}>Expense</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{initialData ? 'Save Changes' : 'Add Rule'}</button>
            </div>
        </form>
    )
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, addTransaction, deleteTransaction, updateTransaction, properties, units, recurringTransactions, addRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurringToEdit, setRecurringToEdit] = useState<RecurringTransaction | null>(null);
  const [recurringToDelete, setRecurringToDelete] = useState<RecurringTransaction | null>(null);
  const [recurringFormOpen, setRecurringFormOpen] = useState(false);

  const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p.address])), [properties]);
  const unitMap = useMemo(() => new Map(units.map(u => [u.id, u.unit_number])), [units]);

  const sortedTransactions = useMemo(() => {
    const filteredItems = transactions.filter(t => {
      // Type filter
      if (filterType !== 'ALL' && t.type !== filterType) {
          return false;
      }

      // Date range filter
      if (startDate && t.date < startDate) {
          return false;
      }
      if (endDate && t.date > endDate) {
          return false;
      }
      
      const propertyAddress = propertyMap.get(t.property_id) || '';
      const unitNumber = t.unit_id ? unitMap.get(t.unit_id) || '' : '';
      const fullAddress = `${propertyAddress} ${unitNumber}`.trim();

      return t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
             fullAddress.toLowerCase().includes(searchTerm.toLowerCase())
    });

    const sortableItems = [...filteredItems];
    if (!sortConfig) return sortableItems;

    sortableItems.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortConfig.key) {
            case 'property':
                aValue = propertyMap.get(a.property_id) || '';
                bValue = propertyMap.get(b.property_id) || '';
                break;
            case 'date':
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
                break;
            case 'amount':
                aValue = a.amount;
                bValue = b.amount;
                break;
            default: // description, category
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
        }
        
        const direction = sortConfig.direction === 'ascending' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }
        
        if (aValue < bValue) {
            return -1 * direction;
        }
        if (aValue > bValue) {
            return 1 * direction;
        }
        return 0;
    });

    return sortableItems;
}, [transactions, sortConfig, propertyMap, unitMap, searchTerm, filterType, startDate, endDate]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleExportCSV = () => {
    if (sortedTransactions.length === 0) {
        alert("No transactions to export.");
        return;
    }

    const headers = ['Date', 'Property Address', 'Unit', 'Description', 'Category', 'Type', 'Amount'];
    
    const csvRows = sortedTransactions.map(t => {
        const propertyAddress = propertyMap.get(t.property_id) || 'N/A';
        const unitNumber = t.unit_id ? unitMap.get(t.unit_id) || 'N/A' : '';
        const amount = t.type === TransactionType.EXPENSE ? -t.amount : t.amount;
        
        const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

        return [
            t.date,
            escapeCSV(propertyAddress),
            escapeCSV(unitNumber),
            escapeCSV(t.description),
            t.category,
            t.type,
            amount.toString()
        ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateNextDueDate = (rt: RecurringTransaction) => {
    const startDate = new Date(rt.start_date + 'T00:00:00'); // Ensure we use local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate > today) {
        return startDate.toLocaleDateString();
    }

    let nextDate = new Date(startDate);
    while (nextDate < today) {
        switch (rt.frequency) {
            case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
            case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
            case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
            case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
        }
    }
    return nextDate.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
        <div className="flex items-center space-x-2">
            <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Export CSV</span>
            </button>
             <button
                onClick={() => setIsRecurringModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
                <ClockCounterClockwiseIcon className="w-5 h-5" />
                <span>Recurring</span>
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
                disabled={properties.length === 0}
                title={properties.length === 0 ? "You must add a property before adding a transaction." : "Add a new transaction"}
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add Transaction</span>
            </button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-end gap-4 transition-colors duration-200">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
              <input
                  id="search"
                  type="text"
                  placeholder="Description, category, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 w-full max-w-xs px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="ALL">All Types</option>
                <option value={TransactionType.INCOME}>Income</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
        </div>
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('date')} className="flex items-center">
                            Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon/> : <SortDescendingIcon/>)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('property')} className="flex items-center">
                            Property / Unit {sortConfig.key === 'property' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon/> : <SortDescendingIcon/>)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('description')} className="flex items-center">
                            Description {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon/> : <SortDescendingIcon/>)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('category')} className="flex items-center">
                            Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon/> : <SortDescendingIcon/>)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('amount')} className="flex items-center justify-end w-full">
                            Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon/> : <SortDescendingIcon/>)}
                        </button>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {sortedTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                {propertyMap.get(t.property_id) || 'N/A'}
                                {t.unit_id && <span className="text-xs block text-slate-400 dark:text-slate-500">{unitMap.get(t.unit_id)}</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 dark:text-slate-200 font-medium">{t.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300">
                                    {t.category}
                                </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {formatCurrency(t.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => setTransactionToEdit(t)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-1" title="Edit transaction">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setTransactionToDelete(t)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1" title="Delete transaction">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-dashed border-slate-200 dark:border-slate-700">
          <EmptyTransactionsIllustration className="mx-auto h-28 w-28" />
          <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">No Transactions Found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{properties.length > 0 ? "Get started by adding your first transaction." : "You need to add a property before you can add transactions."}</p>
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Transaction">
        <TransactionForm onSave={addTransaction} onClose={() => setIsAddModalOpen(false)} properties={properties} units={units} />
      </Modal>

      <Modal isOpen={!!transactionToEdit} onClose={() => setTransactionToEdit(null)} title="Edit Transaction">
        {transactionToEdit && (
            <TransactionForm
                onSave={(updatedData) => {
                    updateTransaction(transactionToEdit.id, updatedData);
                    setTransactionToEdit(null);
                }}
                onClose={() => setTransactionToEdit(null)}
                properties={properties}
                units={units}
                initialTransaction={transactionToEdit}
            />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={() => {
            if (transactionToDelete) {
                deleteTransaction(transactionToDelete.id);
                setTransactionToDelete(null);
            }
        }}
        title="Delete Transaction?"
      >
        Are you sure you want to delete this transaction? This action cannot be undone.
      </ConfirmModal>
      
      <Modal isOpen={isRecurringModalOpen} onClose={() => { setIsRecurringModalOpen(false); setRecurringFormOpen(false); setRecurringToEdit(null); }} title={recurringFormOpen ? (recurringToEdit ? "Edit Recurring Transaction" : "Add Recurring Transaction") : "Recurring Transactions"}>
         {recurringFormOpen ? (
            <RecurringTransactionForm 
                onSave={(data) => {
                    if (recurringToEdit) {
                        updateRecurringTransaction(recurringToEdit.id, data);
                    } else {
                        addRecurringTransaction(data);
                    }
                }}
                onClose={() => { setRecurringFormOpen(false); setRecurringToEdit(null); }}
                properties={properties}
                units={units}
                initialData={recurringToEdit}
            />
         ) : (
            <div className="space-y-4">
                <div className="overflow-y-auto max-h-96">
                    {recurringTransactions.length > 0 ? (
                    <table className="min-w-full">
                        <thead className="sticky top-0 bg-white dark:bg-slate-800">
                            <tr>
                                <th className="py-2 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Description</th>
                                <th className="py-2 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                                <th className="py-2 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Frequency</th>
                                <th className="py-2 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Next Due</th>
                                <th className="py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {recurringTransactions.map(rt => (
                                <tr key={rt.id}>
                                    <td className="py-3 pr-2 text-sm font-medium text-slate-800 dark:text-slate-200">{rt.description}</td>
                                    <td className={`py-3 pr-2 text-sm ${rt.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{formatCurrency(rt.amount)}</td>
                                    <td className="py-3 pr-2 text-sm text-slate-500 dark:text-slate-400 capitalize">{rt.frequency}</td>
                                    <td className="py-3 pr-2 text-sm text-slate-500 dark:text-slate-400">{calculateNextDueDate(rt)}</td>
                                    <td className="py-3 text-right">
                                        <button onClick={() => { setRecurringToEdit(rt); setRecurringFormOpen(true); }} className="p-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"><PencilIcon className="w-4 h-4"/></button>
                                        <button onClick={() => setRecurringToDelete(rt)} className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"><TrashIcon className="w-4 h-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No recurring transactions have been set up yet.</p>
                     )}
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={() => { setRecurringToEdit(null); setRecurringFormOpen(true); }} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add New</button>
                </div>
            </div>
         )}
      </Modal>

       <ConfirmModal
        isOpen={!!recurringToDelete}
        onClose={() => setRecurringToDelete(null)}
        onConfirm={() => {
            if (recurringToDelete) {
                deleteRecurringTransaction(recurringToDelete.id);
                setRecurringToDelete(null);
            }
        }}
        title="Delete Recurring Transaction?"
      >
        Are you sure you want to delete this recurring transaction rule? This action cannot be undone.
      </ConfirmModal>

    </div>
  );
};