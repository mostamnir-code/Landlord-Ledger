
import React, { useState, useMemo, useEffect } from 'react';
import type { Tenant, Property, Transaction, Unit } from '../types';
import { TransactionType } from '../types';
import { Modal } from './Modal';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const AtSymbolIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
    </svg>
);

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const AssignPropertyForm: React.FC<{
    onSave: (unitId: string | null) => void;
    onClose: () => void;
    properties: Property[];
    units: Unit[];
    currentUnitId: string | null;
}> = ({ onSave, onClose, properties, units, currentUnitId }) => {
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(currentUnitId);
    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedUnitId);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="unitId" className="block text-sm font-medium text-slate-700">Select a Unit</label>
                <select 
                    id="unitId" 
                    value={selectedUnitId ?? ''} 
                    onChange={(e) => setSelectedUnitId(e.target.value || null)} 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                    <option value="">Unassigned</option>
                    {properties.map(p => (
                        <optgroup label={p.address} key={p.id}>
                            {units.filter(u => u.property_id === p.id).map(u => (
                                <option key={u.id} value={u.id}>{u.unit_number}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Assignment</button>
            </div>
        </form>
    );
};

interface TenantDetailProps {
  tenant: Tenant;
  unit?: Unit;
  property?: Property;
  transactions: Transaction[];
  properties: Property[];
  units: Unit[];
  onBack: () => void;
  onUpdateNotes: (tenantId: string, notes: string) => void;
  onUpdateTenant: (tenantId: string, updatedInfo: Partial<Omit<Tenant, 'id' | 'notes'>>) => void;
  onUpdateTenantUnit: (tenantId: string, unitId: string | null) => void;
  onSelectProperty: (propertyId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TenantDetail: React.FC<TenantDetailProps> = ({ tenant, unit, property, transactions, properties, units, onBack, onUpdateNotes, onUpdateTenant, onUpdateTenantUnit, onSelectProperty, addTransaction }) => {
    const [notes, setNotes] = useState(tenant.notes || '');
    const [isSaving, setIsSaving] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(tenant.name);
    const [editedEmail, setEditedEmail] = useState(tenant.email);
    const [editedPhone, setEditedPhone] = useState(tenant.phone);

    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentAmount, setPaymentAmount] = useState('');

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        setEditedName(tenant.name);
        setEditedEmail(tenant.email);
        setEditedPhone(tenant.phone);
        setNotes(tenant.notes || '');
    }, [tenant]);

    const handleSave = () => {
        onUpdateTenant(tenant.id, {
            name: editedName,
            email: editedEmail,
            phone: editedPhone,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(tenant.name);
        setEditedEmail(tenant.email);
        setEditedPhone(tenant.phone);
        setIsEditing(false);
    };

    const handleSaveNotes = () => {
        setIsSaving(true);
        onUpdateNotes(tenant.id, notes);
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    const handleRecordPayment = () => {
        if (!property || !unit || !paymentAmount || !paymentDate) {
            return;
        }
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid, positive payment amount.");
            return;
        }

        const newTransaction: Omit<Transaction, 'id'> = {
            property_id: property.id,
            unit_id: unit.id,
            type: TransactionType.INCOME,
            category: 'Rent',
            description: `Rent - ${unit.unit_number}`,
            amount: amount,
            date: paymentDate
        };
        
        addTransaction(newTransaction);
        setPaymentAmount('');
    };


    const paymentHistory = useMemo(() => {
        return transactions
            .filter(t => t.type === TransactionType.INCOME && t.unit_id === tenant.unit_id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, tenant.unit_id]);
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handleAssignUnit = (newUnitId: string | null) => {
        onUpdateTenantUnit(tenant.id, newUnitId);
        setIsAssignModalOpen(false);
    };
    
    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{tenant.name}</h1>
                    <p className="text-slate-500">Tenant Details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Contact Information</h2>
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
                                    <label className="text-xs text-slate-500">Full Name</label>
                                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <AtSymbolIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div className="w-full">
                                    <label className="text-xs text-slate-500">Email</label>
                                    <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <PhoneIcon className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div className="w-full">
                                    <label className="text-xs text-slate-500">Phone</label>
                                    <input type="tel" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} className="font-medium text-slate-800 w-full p-1 border border-slate-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Full Name</p>
                                    <p className="font-medium text-slate-800">{tenant.name}</p>
                                </div>
                            </div>
                             <div className="flex items-center space-x-3">
                                <AtSymbolIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <a href={`mailto:${tenant.email}`} className="font-medium text-slate-800 hover:text-primary-600">{tenant.email}</a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <PhoneIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <a href={`tel:${tenant.phone}`} className="font-medium text-slate-800 hover:text-primary-600">{tenant.phone}</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Lease Information</h2>
                        <button onClick={() => setIsAssignModalOpen(true)} className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md text-sm font-medium hover:bg-slate-300">{property ? 'Reassign' : 'Assign Unit'}</button>
                    </div>
                    {property && unit ? (
                         <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <HomeIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Property</p>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onSelectProperty(property.id);
                                        }}
                                        className="font-medium text-primary-600 hover:text-primary-800 hover:underline"
                                    >
                                        {property.address}, {unit.unit_number}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Monthly Rent</p>
                                    <p className="font-medium text-slate-800">{formatCurrency(unit.rent)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="text-sm text-slate-500">Lease End</p>
                                    <p className="font-medium text-slate-800">{new Date(unit.lease_end).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-slate-500">This tenant is not currently assigned to a unit.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Record Rent Payment</h2>
                {property && unit ? (
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[150px]">
                            <label htmlFor="payment-date" className="block text-sm font-medium text-slate-700">Payment Date</label>
                            <input 
                                type="date" 
                                id="payment-date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label htmlFor="payment-amount" className="block text-sm font-medium text-slate-700">Amount</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-500 sm:text-sm">$</span>
                                </div>
                                <input 
                                    type="number" 
                                    id="payment-amount"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder={unit.rent.toString()}
                                    className="block w-full rounded-md border-slate-300 pl-7 pr-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleRecordPayment}
                                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
                                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                            >
                                Save Payment
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">A tenant must be assigned to a unit before you can record payments.</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Payment History</h2>
                {paymentHistory.length > 0 ? (
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-white border-b border-slate-200">
                                <tr>
                                    <th className="py-2 pr-3 text-left text-sm font-semibold text-slate-600">Date</th>
                                    <th className="py-2 pr-3 text-left text-sm font-semibold text-slate-600">Description</th>
                                    <th className="py-2 pl-3 text-right text-sm font-semibold text-slate-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {paymentHistory.map(t => (
                                    <tr key={t.id}>
                                        <td className="py-3 pr-3 text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="py-3 pr-3 text-sm text-slate-800">{t.description}</td>
                                        <td className="py-3 pl-3 text-right text-sm font-semibold text-green-600">
                                            {formatCurrency(t.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full py-8">
                        <p className="text-slate-500">No payment history found for this tenant.</p>
                    </div>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Tenant Notes</h2>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any relevant notes for this tenant..."
                    className="w-full h-32 p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                    aria-label="Tenant Notes"
                />
                <div className="flex justify-end items-center mt-4">
                    {isSaving && <span className="text-sm text-green-600 mr-4 transition-opacity">Saved!</span>}
                    <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
                        disabled={notes === (tenant.notes || '') || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Notes'}
                    </button>
                </div>
            </div>

            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={property ? "Reassign Tenant" : "Assign Tenant to Unit"}>
                <AssignPropertyForm
                    onSave={handleAssignUnit}
                    onClose={() => setIsAssignModalOpen(false)}
                    properties={properties}
                    units={units}
                    currentUnitId={tenant.unit_id}
                />
            </Modal>
        </div>
    );
};
