
import React, { useMemo, useState, useEffect } from 'react';
import type { Property, Transaction } from '../types';
import { TransactionType } from '../types';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const Card: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowTrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.976 5.197m-4.26-4.26l-6.076 6.077" />
  </svg>
);

const ArrowTrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-3.976-5.197m-4.26 4.26l-6.076-6.077" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

interface PropertyDetailProps {
  property: Property;
  transactions: Transaction[];
  onBack: () => void;
  onUpdateNotes: (propertyId: string, notes: string) => void;
  onUpdateProperty: (propertyId: string, updatedInfo: Partial<Omit<Property, 'id' | 'notes' | 'address'>>) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, transactions, onBack, onUpdateNotes, onUpdateProperty }) => {
    const Recharts = (window as any).Recharts;
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts || {};
    
    const [notes, setNotes] = useState(property.notes || '');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editedTenant, setEditedTenant] = useState(property.tenant);
    const [editedRent, setEditedRent] = useState(String(property.rent));
    const [editedLeaseEnd, setEditedLeaseEnd] = useState(property.lease_end);

    useEffect(() => {
        if (property) {
            setNotes(property.notes || '');
            setEditedTenant(property.tenant);
            setEditedRent(String(property.rent));
            setEditedLeaseEnd(property.lease_end);
            setIsEditing(false); // Reset editing state when property changes
        }
    }, [property]);

    const handleSave = () => {
        const rent = parseFloat(editedRent);
        if (isNaN(rent) || rent < 0) {
            alert('Please enter a valid positive number for rent.');
            return;
        }
        onUpdateProperty(property.id, { 
            tenant: editedTenant, 
            rent: rent, 
            lease_end: editedLeaseEnd 
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedTenant(property.tenant);
        setEditedRent(String(property.rent));
        setEditedLeaseEnd(property.lease_end);
        setIsEditing(false);
    };

    const handleSaveNotes = () => {
        setIsSavingNotes(true);
        onUpdateNotes(property.id, notes);
        setTimeout(() => {
            setIsSavingNotes(false);
        }, 1500);
    };

    const summary = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, netProfit };
    }, [transactions]);
    
    const chartData = useMemo(() => {
        const months: { [key: string]: { income: number, expenses: number } } = {};
        transactions.forEach(t => {
          const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
          if (!months[month]) {
            months[month] = { income: 0, expenses: 0 };
          }
          if (t.type === TransactionType.INCOME) {
            months[month].income += t.amount;
          } else {
            months[month].expenses += t.amount;
          }
        });
        
        const sortedMonths = Object.keys(months).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            const dateA = new Date(`01-${monthA}-20${yearA}`);
            const dateB = new Date(`01-${monthB}-20${yearB}`);
            return dateA.getTime() - dateB.getTime();
        });
    
        return sortedMonths.map(month => ({
          name: month,
          Income: months[month].income,
          Expenses: months[month].expenses,
        }));
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const CustomBarTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          const income = payload.find(p => p.dataKey === 'Income')?.value || 0;
          const expenses = payload.find(p => p.dataKey === 'Expenses')?.value || 0;
          const net = income - expenses;
      
          return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
              <p className="font-bold text-slate-800">{label}</p>
              <p className="text-sm text-green-600">Income: {formatCurrency(income)}</p>
              <p className="text-sm text-red-600">Expenses: {formatCurrency(expenses)}</p>
              <p className={`text-sm font-semibold ${net >= 0 ? 'text-primary-600' : 'text-red-500'}`}>
                Net: {formatCurrency(net)}
              </p>
            </div>
          );
        }
        return null;
    };
    
    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);
    
    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{property.address}</h1>
                    <p className="text-slate-500">Profitability Analysis</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Financial Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Total Income" value={formatCurrency(summary.totalIncome)} icon={<ArrowTrendingUpIcon className="w-6 h-6" />} />
                    <Card title="Total Expenses" value={formatCurrency(summary.totalExpenses)} icon={<ArrowTrendingDownIcon className="w-6 h-6" />} />
                    <Card title="Net Profit" value={formatCurrency(summary.netProfit)} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Lease & Financial Details</h2>
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <button onClick={handleSave} className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">Save</button>
                                <button onClick={handleCancel} className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md text-sm hover:bg-slate-300">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md text-sm font-medium hover:bg-slate-300">Edit</button>
                        )}
                    </div>
                    {isEditing ? (
                         <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div className="w-full">
                                    <label className="text-xs text-slate-500">Tenant Name</label>
                                    <input type="text" value={editedTenant} onChange={(e) => setEditedTenant(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CurrencyDollarIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div className="w-full">
                                    <label className="text-xs text-slate-500">Monthly Rent</label>
                                    <input type="number" value={editedRent} onChange={(e) => setEditedRent(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div className="w-full">
                                    <label className="text-xs text-slate-500">Lease End Date</label>
                                    <input type="date" value={editedLeaseEnd} onChange={(e) => setEditedLeaseEnd(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Tenant Name</p>
                                    <p className="font-medium text-slate-800">{property.tenant}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Monthly Rent</p>
                                    <p className="font-medium text-slate-800">{formatCurrency(property.rent)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Lease End Date</p>
                                    <p className="font-medium text-slate-800">{new Date(property.lease_end).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Monthly Performance</h2>
                    <div style={{ width: '100%', height: 300 }}>
                    {Recharts && BarChart ? (
                        chartData.length > 0 ? (
                        <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} stroke="#64748b" fontSize={12} />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                            <Legend />
                            <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full"><p className="text-slate-500">No data for chart.</p></div>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full"><p className="text-slate-500">Chart library is loading...</p></div>
                    )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Transactions</h2>
                <div className="overflow-y-auto" style={{maxHeight: '300px'}}>
                    {sortedTransactions.length > 0 ? (
                    <table className="min-w-full">
                        <tbody className="divide-y divide-slate-200">
                            {sortedTransactions.map(t => (
                            <tr key={t.id}>
                                <td className="py-3 pr-3">
                                    <p className="text-sm font-medium text-slate-800">{t.description}</p>
                                    <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                                </td>
                                <td className={`py-3 pl-3 text-right text-sm font-semibold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                        <div className="flex items-center justify-center h-full py-4"><p className="text-slate-500">No transactions for this property.</p></div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Property Notes</h2>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any relevant notes for this property..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                    aria-label="Property Notes"
                />
                <div className="flex justify-end items-center mt-4">
                    {isSavingNotes && <span className="text-sm text-green-600 mr-4 transition-opacity">Saved!</span>}
                    <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
                        disabled={notes === (property.notes || '') || isSavingNotes}
                    >
                        {isSavingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                </div>
            </div>
        </div>
    );
};
