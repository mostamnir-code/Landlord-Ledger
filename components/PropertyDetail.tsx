
import React, { useMemo, useState, useEffect } from 'react';
import type { Property, Transaction, Unit } from '../types';
import { TransactionType } from '../types';
import { Modal } from './Modal';
import { ConfirmModal } from './ConfirmModal';

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

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const AddUnitForm: React.FC<{ onSave: (unit: Omit<Unit, 'id' | 'property_id'>) => void; onClose: () => void; initialData?: Unit | null }> = ({ onSave, onClose, initialData }) => {
    const [unitNumber, setUnitNumber] = useState(initialData?.unit_number || '');
    const [rent, setRent] = useState(initialData?.rent.toString() || '');
    const [leaseEnd, setLeaseEnd] = useState(initialData?.lease_end || '');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!unitNumber || !rent || !leaseEnd) return;
      onSave({
        unit_number: unitNumber,
        rent: parseFloat(rent),
        lease_end: leaseEnd,
      });
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="unitNumber" className="block text-sm font-medium text-slate-700">Unit Number / Name</label>
          <input type="text" id="unitNumber" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g., Apt 101, Unit B" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label htmlFor="rent" className="block text-sm font-medium text-slate-700">Monthly Rent ($)</label>
              <input type="number" id="rent" value={rent} onChange={(e) => setRent(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
              <label htmlFor="leaseEnd" className="block text-sm font-medium text-slate-700">Lease End Date</label>
              <input type="date" id="leaseEnd" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{initialData ? 'Save Changes' : 'Add Unit'}</button>
        </div>
      </form>
    );
};

interface PropertyDetailProps {
  property: Property;
  units: Unit[];
  transactions: Transaction[];
  onBack: () => void;
  onUpdateNotes: (propertyId: string, notes: string) => void;
  onUpdateProperty: (propertyId: string, updatedInfo: Partial<Omit<Property, 'id' | 'notes'>>) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (unitId: string, updatedInfo: Partial<Omit<Unit, 'id' | 'property_id'>>) => void;
  deleteUnit: (unitId: string) => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, units, transactions, onBack, onUpdateNotes, onUpdateProperty, addUnit, updateUnit, deleteUnit }) => {
    const Recharts = (window as any).Recharts;
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts || {};
    
    const [notes, setNotes] = useState(property.notes || '');
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
    const [unitToEdit, setUnitToEdit] = useState<Unit | null>(null);
    const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        setNotes(property.notes || '');
    }, [property]);

    const handleSaveNotes = () => {
        setIsSavingNotes(true);
        onUpdateNotes(property.id, notes);
        setTimeout(() => {
            setIsSavingNotes(false);
        }, 1500);
    };

    const handleAddUnit = (unitData: Omit<Unit, 'id' | 'property_id'>) => {
        addUnit({ ...unitData, property_id: property.id });
    };

    const handleUpdateUnit = (unitData: Omit<Unit, 'id' | 'property_id'>) => {
        if (unitToEdit) {
            updateUnit(unitToEdit.id, unitData);
        }
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
    
    const filteredTransactions = useMemo(() => {
        return [...transactions]
            .filter(t => {
                if (startDate && t.date < startDate) return false;
                if (endDate && t.date > endDate) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, startDate, endDate]);
    
    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{property.address}</h1>
                    <p className="text-slate-500">Property Overview & Units</p>
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

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Units</h2>
                    <button onClick={() => setIsAddUnitModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700">Add Unit</button>
                </div>
                {units.length > 0 ? (
                    <div className="space-y-3">
                        {units.map(unit => (
                            <div key={unit.id} className="bg-slate-50 p-4 rounded-md border border-slate-200 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="font-bold text-slate-800">{unit.unit_number}</p>
                                    <p className="text-sm text-slate-500">Rent: {formatCurrency(unit.rent)}/mo | Lease Ends: {new Date(unit.lease_end).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setUnitToEdit(unit)} className="text-primary-600 hover:text-primary-900 p-2" title="Edit unit">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setUnitToDelete(unit)} className="text-red-600 hover:text-red-900 p-2" title="Delete unit">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-4">No units have been added to this property yet.</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Financial Performance</h2>
                    <div style={{ width: '100%', height: 300 }}>
                    {Recharts && BarChart && chartData.length > 0 ? (
                        <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} stroke="#64748b" />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                            <Legend />
                            <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 text-center">No transaction data available to display chart.</p>
                        </div>
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

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Transactions</h2>
                
                <div className="flex flex-wrap gap-4 mb-4 items-end">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700">Start Date</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700">End Date</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                             className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredTransactions.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredTransactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{t.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                    {t.category}
                                </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === TransactionType.INCOME ? '+' : ''}{formatCurrency(t.amount)}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No transactions found for the selected date range.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isAddUnitModalOpen} onClose={() => setIsAddUnitModalOpen(false)} title="Add New Unit">
                <AddUnitForm onSave={handleAddUnit} onClose={() => setIsAddUnitModalOpen(false)} />
            </Modal>
            <Modal isOpen={!!unitToEdit} onClose={() => setUnitToEdit(null)} title="Edit Unit">
                <AddUnitForm onSave={handleUpdateUnit} onClose={() => setUnitToEdit(null)} initialData={unitToEdit} />
            </Modal>
            <ConfirmModal
                isOpen={!!unitToDelete}
                onClose={() => setUnitToDelete(null)}
                onConfirm={() => {
                    if (unitToDelete) {
                        deleteUnit(unitToDelete.id);
                        setUnitToDelete(null);
                    }
                }}
                title="Delete Unit?"
            >
                Are you sure you want to delete unit "{unitToDelete?.unit_number}"? This will also unassign any tenants and delete associated transactions. This action cannot be undone.
            </ConfirmModal>
        </div>
    );
};
