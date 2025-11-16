
import React, { useMemo } from 'react';
import type { Property, Transaction } from '../types';
import { TransactionType } from '../types';

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


interface DashboardProps {
  properties: Property[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ properties, transactions }) => {
  const Recharts = (window as any).Recharts;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } = Recharts || {};

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

  const expenseByCategory = useMemo(() => {
    const expenseData = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categoryMap: { [key: string]: number } = {};
    expenseData.forEach(t => {
        if (!categoryMap[t.category]) {
            categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
    });

    return Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#0ea5e9', '#f43f5e', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Income" value={formatCurrency(summary.totalIncome)} icon={<ArrowTrendingUpIcon className="w-6 h-6" />} />
        <Card title="Total Expenses" value={formatCurrency(summary.totalExpenses)} icon={<ArrowTrendingDownIcon className="w-6 h-6" />} />
        <Card title="Net Profit" value={formatCurrency(summary.netProfit)} icon={<CurrencyDollarIcon className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Income vs. Expenses</h2>
            <div style={{ width: '100%', height: 400 }}>
            {Recharts && BarChart ? (
                <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} stroke="#64748b" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Chart library is loading or has failed to load.</p>
                </div>
            )}
            </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Expense Breakdown</h2>
            <div style={{ width: '100%', height: 400 }}>
            {Recharts && PieChart ? (
                expenseByCategory.length > 0 ? (
                <ResponsiveContainer>
                    <PieChart>
                    <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ right: -10 }} />
                    </PieChart>
                </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">No expense data available.</p>
                    </div>
                )
            ) : (
                <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Chart library is loading...</p>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};
