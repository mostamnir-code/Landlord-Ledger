import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Properties } from './components/Properties';
import { TransactionsView } from './components/TransactionsView';
import { AIAssistant } from './components/AIAssistant';
import type { Property, Transaction } from './types';
import { TransactionType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  const [properties, setProperties] = useState<Property[]>([
    { id: 'p1', address: '123 Maple St, Springfield', tenant: 'John Doe', rent: 1200, leaseEnd: '2024-12-31' },
    { id: 'p2', address: '456 Oak Ave, Shelbyville', tenant: 'Jane Smith', rent: 1450, leaseEnd: '2025-06-30' },
    { id: 'p3', address: '789 Pine Ln, Capital City', tenant: 'Peter Jones', rent: 950, leaseEnd: '2024-08-31' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', propertyId: 'p1', type: TransactionType.INCOME, description: 'Rent Payment - Dec', amount: 1200, date: '2023-12-05', category: 'Rent' },
    { id: 't2', propertyId: 'p2', type: TransactionType.INCOME, description: 'Rent Payment - Dec', amount: 1450, date: '2023-12-03', category: 'Rent' },
    { id: 't3', propertyId: 'p1', type: TransactionType.EXPENSE, description: 'Plumbing Repair', amount: 250, date: '2023-12-10', category: 'Repairs' },
    { id: 't4', propertyId: 'p3', type: TransactionType.INCOME, description: 'Rent Payment - Dec', amount: 950, date: '2023-12-01', category: 'Rent' },
    { id: 't5', propertyId: 'p2', type: TransactionType.EXPENSE, description: 'HOA Fees', amount: 150, date: '2023-12-15', category: 'HOA Fees' },
    { id: 't6', propertyId: 'p1', type: TransactionType.INCOME, description: 'Rent Payment - Jan', amount: 1200, date: '2024-01-05', category: 'Rent' },
    { id: 't7', propertyId: 'p2', type: TransactionType.INCOME, description: 'Rent Payment - Jan', amount: 1450, date: '2024-01-03', category: 'Rent' },
    { id: 't8', propertyId: 'p3', type: TransactionType.EXPENSE, description: 'New Appliance', amount: 600, date: '2024-01-20', category: 'Repairs' },
    { id: 't9', propertyId: 'p3', type: TransactionType.INCOME, description: 'Rent Payment - Jan', amount: 950, date: '2024-01-01', category: 'Rent' },
  ]);

  const addProperty = (property: Omit<Property, 'id'>) => {
    const newProperty: Property = { ...property, id: `p${Date.now()}` };
    setProperties(prev => [...prev, newProperty]);
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    // Also delete associated transactions
    setTransactions(prev => prev.filter(t => t.propertyId !== propertyId));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transaction, id: `t${Date.now()}` };
    setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };


  const dataContext = useMemo(() => ({
    properties,
    transactions,
    addProperty,
    addTransaction
  }), [properties, transactions]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard properties={properties} transactions={transactions} />;
      case 'properties':
        return <Properties properties={properties} addProperty={addProperty} deleteProperty={deleteProperty} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} properties={properties} />;
      default:
        return <Dashboard properties={properties} transactions={transactions} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <AIAssistant properties={properties} transactions={transactions} />
    </div>
  );
};

export default App;
