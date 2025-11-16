
import React, { useState, useMemo, useEffect } from 'react';
import type { Property, Transaction } from '../types';
import { TransactionType, IncomeCategories, ExpenseCategories } from '../types';
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

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const SortAscendingIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/></svg>
)
const SortDescendingIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
)

const EmptyTransactionsIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 10.5H63V73.5L56 66.5L49 73.5L42 66.5L35 73.5L28 66.5L21 73.5V10.5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M35 31.5H49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"/>
        <path d="M35 45.5H49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"/>
    </svg>
);

type SortKey = 'date' | 'property' | 'description' | 'category' | 'amount';

const AddTransactionForm: React.FC<{ 
  onAdd: (transaction: Omit<Transaction, 'id'>) => void; 
  onClose: () => void; 
  properties: Property[];
}> = ({ onAdd, onClose, properties }) => {
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [category, setCategory] = useState<string>(IncomeCategories[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (type === TransactionType.INCOME) {
        setCategory(IncomeCategories[0]);
    } else {
        setCategory(ExpenseCategories[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !description || !amount || !date || !category) return;
    onAdd({ property_id: propertyId, type, category, description, amount: parseFloat(amount), date });
    onClose();
  };

  const categories = type === TransactionType.INCOME ? IncomeCategories : ExpenseCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700">Property</label>
        <select id="propertyId" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
          {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-slate-700">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
          <option value={TransactionType.INCOME}>Income</option>
          <option value={TransactionType.EXPENSE}>Expense</option>
        </select>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Transaction</button>
      </div>
    </form>
  );
};

interface TransactionsViewProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transactionId: string) => void;
  properties: Property[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, addTransaction, deleteTransaction, properties }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });
  const [searchTerm, setSearchTerm] = useState('');

  const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p.address])), [properties]);

  const sortedTransactions = useMemo(() => {
    const filteredItems = transactions.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
}, [transactions, sortConfig, propertyMap, searchTerm]);

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
    if (transactions.length === 0) {
        alert("No transactions to export.");
        return;
    }

    const headers = ['Date', 'Property Address', 'Description', 'Category', 'Type', 'Amount'];
    
    const csvRows = sortedTransactions.map(t => {
        const propertyAddress = propertyMap.get(t.property_id) || 'N/A';
        const amount = t.type === TransactionType.EXPENSE ? -t.amount : t.amount;
        
        const escapeCsvField = (field: string | number) => {
            const stringField = String(field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        return [
            new Date(t.date).toLocaleDateString(),
            escapeCsvField(propertyAddress),
            escapeCsvField(t.description),
            escapeCsvField(t.category),
            t.type,
            amount
        ].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const currentDate = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `landlord-ledger-export-${currentDate}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-52 pl-10 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                title="Export all transactions to a CSV file"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:bg-primary-300" disabled={properties.length === 0}>
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Add New</span>
            </button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {sortedTransactions.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => requestSort('date')} className="inline-flex items-center">
                        Date
                        {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon /> : <SortDescendingIcon />)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => requestSort('property')} className="inline-flex items-center">
                        Property
                        {sortConfig.key === 'property' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon /> : <SortDescendingIcon />)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => requestSort('description')} className="inline-flex items-center">
                        Description
                        {sortConfig.key === 'description' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon /> : <SortDescendingIcon />)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => requestSort('category')} className="inline-flex items-center">
                        Category
                        {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon /> : <SortDescendingIcon />)}
                        </button>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <button onClick={() => requestSort('amount')} className="inline-flex items-center">
                        Amount
                        {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? <SortAscendingIcon /> : <SortDescendingIcon />)}
                        </button>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {sortedTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{propertyMap.get(t.property_id) || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                            {t.category}
                        </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === TransactionType.INCOME ? '+' : ''}{formatCurrency(t.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setTransactionToDelete(t)} className="text-slate-400 hover:text-red-600" aria-label={`Delete transaction ${t.description}`}>
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="text-center p-16">
                    <h3 className="text-lg font-medium text-slate-800">No Results Found</h3>
                    <p className="mt-1 text-sm text-slate-500">Your search for "{searchTerm}" did not match any transactions.</p>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
            <EmptyTransactionsIllustration className="mx-auto h-28 w-28" />
            <h3 className="mt-4 text-lg font-medium text-slate-800">No Transactions Logged</h3>
            <p className="mt-1 text-sm text-slate-500">Add your first income or expense record to see it here.</p>
        </div>
      )}


      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Transaction">
        <AddTransactionForm onAdd={addTransaction} onClose={() => setIsAddModalOpen(false)} properties={properties} />
      </Modal>

      <ConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={() => {
            if (transactionToDelete) {
                deleteTransaction(transactionToDelete.id);
            }
        }}
        title="Delete Transaction?"
      >
        Are you sure you want to delete this transaction? This action cannot be undone.
      </ConfirmModal>
    </div>
  );
};
