
import React, { useMemo } from 'react';
import type { Tenant, Unit, Property, Transaction, PaymentSettings } from '../types';
import { TransactionType } from '../types';

interface OnlinePaymentsProps {
    tenants: Tenant[];
    units: Unit[];
    properties: Property[];
    transactions: Transaction[];
    paymentSettings: PaymentSettings;
    tenantOnlinePay: Record<string, boolean>;
    onNavigate: (view: string) => void;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}


const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);

const NoPaymentsIllustration: React.FC = () => (
    <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
        <CreditCardIcon className="mx-auto h-20 w-20 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-800">No Tenants Enabled</h3>
        <p className="mt-1 text-sm text-slate-500">Enable online payments for tenants to see their status here.</p>
    </div>
);


export const OnlinePayments: React.FC<OnlinePaymentsProps> = ({ tenants, units, properties, transactions, paymentSettings, tenantOnlinePay, onNavigate, addTransaction }) => {
    
    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p.address])), [properties]);
    const unitMap = useMemo(() => new Map(units.map(u => [u.id, u])), [units]);

    const tenantsWithPaymentsEnabled = tenants.filter(t => tenantOnlinePay[t.id]);

    const onlinePaymentsThisMonth = useMemo(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return transactions.filter(t => 
            t.type === TransactionType.INCOME &&
            new Date(t.date) >= firstDay &&
            t.description.toLowerCase().includes('online payment') 
        );
    }, [transactions]);

    const totalCollected = onlinePaymentsThisMonth.reduce((acc, t) => acc + t.amount, 0);

    const handleSimulatePayment = (tenant: Tenant, unit: Unit) => {
        const transaction: Omit<Transaction, 'id'> = {
            property_id: unit.property_id,
            unit_id: unit.id,
            type: TransactionType.INCOME,
            description: `Online Payment - Rent - ${unit.unit_number}`,
            amount: unit.rent,
            date: new Date().toISOString().split('T')[0],
            category: 'Rent',
        };
        addTransaction(transaction);
        alert(`Simulated receiving rent of $${unit.rent} from ${tenant.name}.`);
    };

    if (!paymentSettings.stripe_connected) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Online Payments</h1>
                <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
                    <CreditCardIcon className="mx-auto h-20 w-20 text-slate-300" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800">Payment Gateway Not Connected</h3>
                    <p className="mt-2 text-sm text-slate-500">You need to connect a payment provider like Stripe to accept online payments.</p>
                    <button onClick={() => onNavigate('settings')} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                        Go to Settings
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Online Payments</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">This Month's Summary</h2>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-primary-600">${totalCollected.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">Collected Online</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold text-slate-800">{onlinePaymentsThisMonth.length}</p>
                        <p className="text-sm text-slate-500">Transactions</p>
                    </div>
                </div>
            </div>
            
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 <h2 className="text-xl font-bold text-slate-800 p-6">Payment Status</h2>
                 {tenantsWithPaymentsEnabled.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property / Unit</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rent Due</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status This Month</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {tenantsWithPaymentsEnabled.map(tenant => {
                                    const unit = tenant.unit_id ? unitMap.get(tenant.unit_id) : null;
                                    const propertyAddress = unit ? propertyMap.get(unit.property_id) : 'N/A';
                                    
                                    const today = new Date();
                                    const rentPaidThisMonth = transactions
                                        .filter(t => t.unit_id === tenant.unit_id && t.type === TransactionType.INCOME && new Date(t.date).getMonth() === today.getMonth() && new Date(t.date).getFullYear() === today.getFullYear())
                                        .reduce((sum, t) => sum + t.amount, 0);
                                    
                                    let status = <span className="text-slate-500">Awaiting</span>;
                                    if (unit && rentPaidThisMonth >= unit.rent) {
                                        status = <span className="font-semibold text-green-600">Paid</span>;
                                    } else if (today.getDate() > 5 && rentPaidThisMonth < (unit?.rent || 0)) {
                                        status = <span className="font-semibold text-red-600">Overdue</span>;
                                    }

                                    if (!unit) return null;

                                    return (
                                        <tr key={tenant.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{tenant.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {propertyAddress}, {unit.unit_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${unit.rent}/mo</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleSimulatePayment(tenant, unit)} className="text-primary-600 hover:text-primary-900">
                                                    Simulate Payment
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                     </div>
                 ) : (
                    <NoPaymentsIllustration />
                 )}
            </div>
        </div>
    );
};
