
import React, { useState, useMemo } from 'react';
import type { Property, Transaction, Unit } from '../types';
import { TransactionType } from '../types';

const PrinterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 17.25h.75v.75h-.75v-.75zM6.75 21.813h.75v.075h-.75v-.075zM16.5 21.813h.75v.075h-.75v-.075zM16.5 17.25h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v-2.25c0-.414.336-.75.75-.75h10.5c.414 0 .75.336.75.75V12m-12 0v6.75c0 .414.336.75.75.75h10.5c.414 0 .75-.336.75-.75V12m-12 0h12" />
    </svg>
);

interface ReportsProps {
    properties: Property[];
    transactions: Transaction[];
    units: Unit[];
}

export const Reports: React.FC<ReportsProps> = ({ properties, transactions, units }) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const txDate = t.date;
            const isDateInRange = txDate >= startDate && txDate <= endDate;
            const isPropertyMatch = selectedPropertyId === 'all' || t.property_id === selectedPropertyId;
            return isDateInRange && isPropertyMatch;
        });
    }, [transactions, startDate, endDate, selectedPropertyId]);

    const summary = useMemo(() => {
        let income = 0;
        let expenses = 0;
        const categoryBreakdown: Record<string, { income: number; expenses: number }> = {};
        const propertyBreakdown: Record<string, { income: number; expenses: number; address: string }> = {};

        // Initialize property breakdown with 0s for all properties (if 'all' selected)
        if (selectedPropertyId === 'all') {
            properties.forEach(p => {
                propertyBreakdown[p.id] = { income: 0, expenses: 0, address: p.address };
            });
        }

        filteredTransactions.forEach(t => {
            if (t.type === TransactionType.INCOME) {
                income += t.amount;
                if (!categoryBreakdown[t.category]) categoryBreakdown[t.category] = { income: 0, expenses: 0 };
                categoryBreakdown[t.category].income += t.amount;
                
                if (selectedPropertyId === 'all' && propertyBreakdown[t.property_id]) {
                    propertyBreakdown[t.property_id].income += t.amount;
                }
            } else {
                expenses += t.amount;
                if (!categoryBreakdown[t.category]) categoryBreakdown[t.category] = { income: 0, expenses: 0 };
                categoryBreakdown[t.category].expenses += t.amount;

                if (selectedPropertyId === 'all' && propertyBreakdown[t.property_id]) {
                    propertyBreakdown[t.property_id].expenses += t.amount;
                }
            }
        });

        return { income, expenses, net: income - expenses, categoryBreakdown, propertyBreakdown };
    }, [filteredTransactions, selectedPropertyId, properties]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handlePrint = () => {
        window.print();
    };

    const getPropertyName = () => {
        if (selectedPropertyId === 'all') return 'All Properties';
        const prop = properties.find(p => p.id === selectedPropertyId);
        return prop ? prop.address : 'Unknown Property';
    };

    return (
        <div className="space-y-6">
            {/* Controls - Hidden when printing */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Reports</h1>
                <div className="flex flex-wrap gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <select 
                        value={selectedPropertyId} 
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.address}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white text-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                        <span className="text-slate-400">-</span>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white text-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium transition-colors"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="bg-white dark:bg-slate-800 print:bg-white print:text-black p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none min-h-[600px] print:min-h-0">
                
                {/* Report Header */}
                <div className="text-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700 print:border-black">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black mb-2">Profit & Loss Statement</h2>
                    <h3 className="text-lg text-slate-600 dark:text-slate-300 print:text-gray-600">{getPropertyName()}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 print:text-gray-500 mt-1">
                        Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* Executive Summary */}
                <div className="grid grid-cols-3 gap-6 mb-8 break-inside-avoid">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 print:bg-gray-50 rounded-lg text-center">
                        <p className="text-sm font-medium text-green-800 dark:text-green-400 print:text-black mb-1">Total Income</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300 print:text-black">{formatCurrency(summary.income)}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 print:bg-gray-50 rounded-lg text-center">
                        <p className="text-sm font-medium text-red-800 dark:text-red-400 print:text-black mb-1">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300 print:text-black">{formatCurrency(summary.expenses)}</p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${summary.net >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} print:bg-gray-50`}>
                        <p className={`text-sm font-medium mb-1 ${summary.net >= 0 ? 'text-blue-800 dark:text-blue-400' : 'text-orange-800 dark:text-orange-400'} print:text-black`}>Net Profit</p>
                        <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'} print:text-black`}>{formatCurrency(summary.net)}</p>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 break-inside-avoid">
                    <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white print:text-black mb-4 border-b pb-2">Income by Category</h4>
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-500 dark:text-slate-400 print:text-gray-500 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="py-2">Category</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {(Object.entries(summary.categoryBreakdown) as [string, { income: number; expenses: number }][])
                                    .filter(([_, val]) => val.income > 0)
                                    .sort((a, b) => b[1].income - a[1].income)
                                    .map(([cat, val]) => (
                                    <tr key={cat}>
                                        <td className="py-2 text-slate-700 dark:text-slate-300 print:text-black">{cat}</td>
                                        <td className="py-2 text-right text-slate-700 dark:text-slate-300 print:text-black font-medium">{formatCurrency(val.income)}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-slate-50 dark:bg-slate-700/50 print:bg-gray-100">
                                    <td className="py-2 pl-2 text-slate-900 dark:text-white print:text-black">Total Income</td>
                                    <td className="py-2 text-right text-slate-900 dark:text-white print:text-black">{formatCurrency(summary.income)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white print:text-black mb-4 border-b pb-2">Expenses by Category</h4>
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-500 dark:text-slate-400 print:text-gray-500 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="py-2">Category</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {(Object.entries(summary.categoryBreakdown) as [string, { income: number; expenses: number }][])
                                    .filter(([_, val]) => val.expenses > 0)
                                    .sort((a, b) => b[1].expenses - a[1].expenses)
                                    .map(([cat, val]) => (
                                    <tr key={cat}>
                                        <td className="py-2 text-slate-700 dark:text-slate-300 print:text-black">{cat}</td>
                                        <td className="py-2 text-right text-slate-700 dark:text-slate-300 print:text-black font-medium">{formatCurrency(val.expenses)}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-slate-50 dark:bg-slate-700/50 print:bg-gray-100">
                                    <td className="py-2 pl-2 text-slate-900 dark:text-white print:text-black">Total Expenses</td>
                                    <td className="py-2 text-right text-slate-900 dark:text-white print:text-black">{formatCurrency(summary.expenses)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Property Performance Breakdown (Only visible when 'All Properties' is selected) */}
                {selectedPropertyId === 'all' && Object.keys(summary.propertyBreakdown).length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 print:border-black break-inside-avoid">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white print:text-black mb-4">Performance by Property</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 print:bg-gray-100 text-slate-500 dark:text-slate-400 print:text-black font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Property</th>
                                        <th className="px-4 py-3 text-right text-green-600 dark:text-green-400 print:text-black">Income</th>
                                        <th className="px-4 py-3 text-right text-red-600 dark:text-red-400 print:text-black">Expenses</th>
                                        <th className="px-4 py-3 text-right rounded-r-lg">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {(Object.values(summary.propertyBreakdown) as { income: number; expenses: number; address: string }[])
                                        .sort((a, b) => (b.income - b.expenses) - (a.income - a.expenses))
                                        .map((prop) => {
                                            const net = prop.income - prop.expenses;
                                            return (
                                                <tr key={prop.address}>
                                                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 print:text-black">{prop.address}</td>
                                                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 print:text-black">{formatCurrency(prop.income)}</td>
                                                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 print:text-black">{formatCurrency(prop.expenses)}</td>
                                                    <td className={`px-4 py-3 text-right font-bold ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} print:text-black`}>
                                                        {formatCurrency(net)}
                                                    </td>
                                                </tr>
                                            );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                 {/* Footer */}
                 <div className="mt-12 pt-4 border-t border-slate-200 dark:border-slate-700 print:border-black text-center text-xs text-slate-400 dark:text-slate-500 print:text-gray-500">
                    Generated on {new Date().toLocaleDateString()} by Landlord Ledger
                </div>
            </div>
        </div>
    );
};
