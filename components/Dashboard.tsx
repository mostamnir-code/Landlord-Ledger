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

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

interface DashboardProps {
  properties: Property[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ properties, transactions }) => {
  const Recharts = (window as any).Recharts;
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Brush, AreaChart, Area } = Recharts || {};

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
  
  const projectedCashFlowData = useMemo(() => {
    const months: { [key: string]: boolean } = {};
    transactions.forEach(t => {
      const monthKey = t.date.substring(0, 7); 
      months[monthKey] = true;
    });

    const numMonths = Object.keys(months).length;
    if (numMonths < 1) return []; // Not enough data for projection

    const averageMonthlyNet = summary.netProfit / numMonths;

    const projections = [];
    let cumulativeCashFlow = summary.netProfit;
    const currentDate = new Date();
    
    for (let i = 1; i <= 6; i++) {
        const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthName = futureDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        cumulativeCashFlow += averageMonthlyNet;
        projections.push({
            name: monthName,
            'Projected Cash Flow': Math.round(cumulativeCashFlow)
        });
    }

    return projections;
  }, [transactions, summary.netProfit]);

  const COLORS = ['#0ea5e9', '#f43f5e', '#f97316', '#10b981', '#8b5cf6', '#ec4899'];

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
  
  const CustomPieTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
          const data = payload[0];
          if (summary.totalExpenses > 0) {
            const percentage = ((data.value / summary.totalExpenses) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-bold text-slate-800">{data.name}</p>
                    <p className="text-sm" style={{ color: data.payload.fill }}>
                        Amount: {formatCurrency(data.value)} ({percentage}%)
                    </p>
                </div>
            );
          }
          return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                <p className="font-bold text-slate-800">{data.name}</p>
                <p className="text-sm" style={{ color: data.payload.fill }}>
                    Amount: {formatCurrency(data.value)}
                </p>
            </div>
          );
      }
      return null;
  };
  
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-sm text-primary-600">
            Projected Balance: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
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
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Legend />
                    <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Brush dataKey="name" height={30} stroke="#3b82f6" fill="#eff6ff" />
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
                    <Tooltip content={<CustomPieTooltip />} />
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
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 text-primary-600 p-2 rounded-full">
                <ChartBarIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">6-Month Projected Cash Flow</h2>
        </div>
        <div style={{ width: '100%', height: 300 }}>
            {Recharts && AreaChart ? (
                projectedCashFlowData.length > 0 ? (
                <ResponsiveContainer>
                    <AreaChart data={projectedCashFlowData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} stroke="#64748b" domain={['dataMin - 1000', 'dataMax + 1000']}/>
                        <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Area type="monotone" dataKey="Projected Cash Flow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProjection)" />
                    </AreaChart>
                </ResponsiveContainer>
                 ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 text-center">Not enough transaction data to generate a projection. <br/> Please add more income/expense records.</p>
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
  );
};
