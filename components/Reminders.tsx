
import React, { useState, useMemo } from 'react';
import type { Tenant, Unit, Property, Transaction, Reminder } from '../types';
import { Modal } from './Modal';
import { TransactionType } from '../types';

const BellAlertIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
    </svg>
);

const ReminderSettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: Partial<Reminder> & { tenant_id: string }) => Promise<void>;
    tenant: Tenant;
    reminder: Reminder | undefined;
}> = ({ isOpen, onClose, onSave, tenant, reminder }) => {
    const [enabled, setEnabled] = useState(reminder?.enabled ?? false);
    const [dueDateDays, setDueDateDays] = useState(reminder?.due_date_reminder_days ?? 3);
    const [lateFeeDays, setLateFeeDays] = useState(reminder?.late_fee_reminder_days ?? 2);
    const [lateFeeAmount, setLateFeeAmount] = useState(reminder?.late_fee_amount ?? 50);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                id: reminder?.id,
                tenant_id: tenant.id,
                enabled,
                due_date_reminder_days: Number(dueDateDays),
                late_fee_reminder_days: Number(lateFeeDays),
                late_fee_amount: Number(lateFeeAmount),
            });
            onClose();
        } catch (error) {
            console.error("Failed to save reminder settings", error);
            alert("Failed to save settings. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Reminder Settings for ${tenant.name}`}>
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                    <label htmlFor="enabled" className="font-medium text-slate-800">Enable Automated Reminders</label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            name="enabled"
                            id="enabled"
                            checked={enabled}
                            onChange={() => setEnabled(!enabled)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                         <label htmlFor="enabled" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                    </div>
                </div>
                <div className={`space-y-4 transition-opacity ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label htmlFor="dueDateDays" className="block text-sm font-medium text-slate-700">Send rent reminder</label>
                        <div className="flex items-center mt-1">
                            <input type="number" id="dueDateDays" value={dueDateDays} onChange={(e) => setDueDateDays(Number(e.target.value))} className="w-20 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                            <span className="ml-2 text-slate-600">days before rent is due.</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lateFeeDays" className="block text-sm font-medium text-slate-700">Send late fee notice</label>
                        <div className="flex items-center mt-1">
                            <input type="number" id="lateFeeDays" value={lateFeeDays} onChange={(e) => setLateFeeDays(Number(e.target.value))} className="w-20 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                            <span className="ml-2 text-slate-600">days after rent is due.</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lateFeeAmount" className="block text-sm font-medium text-slate-700">Late Fee Amount</label>
                         <div className="relative mt-1 rounded-md shadow-sm w-40">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-slate-500 sm:text-sm">$</span>
                            </div>
                            <input type="number" id="lateFeeAmount" value={lateFeeAmount} onChange={(e) => setLateFeeAmount(Number(e.target.value))} className="block w-full rounded-md border-slate-300 pl-7 pr-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300">
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
             <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #3b82f6; }
                .toggle-checkbox:checked + .toggle-label { background-color: #3b82f6; }
            `}</style>
        </Modal>
    );
};

interface RemindersProps {
    tenants: Tenant[];
    units: Unit[];
    properties: Property[];
    transactions: Transaction[];
    reminders: Reminder[];
    upsertReminder: (reminderData: Partial<Reminder> & { tenant_id: string }) => Promise<void>;
}

export const Reminders: React.FC<RemindersProps> = ({ tenants, units, properties, transactions, reminders, upsertReminder }) => {
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const unitMap = useMemo(() => new Map(units.map(u => [u.id, u])), [units]);
    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
    const reminderMap = useMemo(() => new Map(reminders.map(r => [r.tenant_id, r])), [reminders]);

    const { upcomingReminders, lateFeeAlerts } = useMemo(() => {
        const upcoming: any[] = [];
        const late: any[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        tenants.forEach(tenant => {
            const reminder = reminderMap.get(tenant.id);
            if (!reminder?.enabled || !tenant.unit_id) return;

            const unit = unitMap.get(tenant.id);
            if (!unit) return;
            
            const rentDueDate = new Date(currentYear, currentMonth, 1);
            
            // Check for upcoming rent reminder
            const reminderDate = new Date(rentDueDate);
            reminderDate.setDate(rentDueDate.getDate() - reminder.due_date_reminder_days);
            if (today >= reminderDate && today < rentDueDate) {
                upcoming.push({ tenant, unit });
            }

            // Check for late fee alert
            const lateFeeDate = new Date(rentDueDate);
            lateFeeDate.setDate(rentDueDate.getDate() + reminder.late_fee_reminder_days);
            if (today >= lateFeeDate) {
                const rentPaidThisMonth = transactions.some(t => 
                    t.unit_id === tenant.unit_id &&
                    t.type === TransactionType.INCOME &&
                    t.category === 'Rent' &&
                    new Date(t.date).getMonth() === currentMonth &&
                    new Date(t.date).getFullYear() === currentYear
                );

                if (!rentPaidThisMonth) {
                    late.push({ tenant, unit, reminder });
                }
            }
        });
        return { upcomingReminders: upcoming, lateFeeAlerts: late };
    }, [tenants, units, reminders, transactions, reminderMap, unitMap]);

    const expiringLeases = useMemo(() => {
        const expiring = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);

        for (const tenant of tenants) {
            if (!tenant.unit_id) continue;
            const unit = unitMap.get(tenant.unit_id);
            if (!unit) continue;

            const leaseEndDate = new Date(unit.lease_end);
            if (leaseEndDate >= today && leaseEndDate <= ninetyDaysFromNow) {
                const property = propertyMap.get(unit.property_id);
                const timeDiff = leaseEndDate.getTime() - today.getTime();
                const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                expiring.push({ tenant, unit, property, daysRemaining });
            }
        }
        return expiring.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [tenants, units, properties, unitMap, propertyMap]);


    const getDaysRemainingColor = (days: number) => {
        if (days < 30) return 'text-red-600 bg-red-100';
        if (days < 60) return 'text-orange-600 bg-orange-100';
        return 'text-yellow-600 bg-yellow-100';
    };


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Automated Reminders</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BellAlertIcon className="w-6 h-6 text-primary-600" />
                        <span>Action Required</span>
                    </h2>
                    {(upcomingReminders.length === 0 && lateFeeAlerts.length === 0) ? (
                         <p className="text-slate-500 pt-4">No upcoming or overdue reminders at this time.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingReminders.map(({ tenant, unit }) => (
                                <div key={tenant.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <p className="font-semibold text-blue-800">Upcoming Reminder</p>
                                    <p className="text-sm text-blue-700">A rent reminder is due to be sent to <strong>{tenant.name}</strong> for unit {unit.unit_number}.</p>
                                </div>
                            ))}
                            {lateFeeAlerts.map(({ tenant, unit, reminder }) => (
                                <div key={tenant.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <p className="font-semibold text-red-800">Late Fee Alert</p>
                                    <p className="text-sm text-red-700">Rent for unit {unit.unit_number} is overdue. A late fee notice for <strong>${reminder.late_fee_amount}</strong> should be sent to <strong>{tenant.name}</strong>.</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDaysIcon className="w-6 h-6 text-primary-600" />
                        <span>Lease Renewals</span>
                    </h2>
                     {expiringLeases.length === 0 ? (
                        <p className="text-slate-500 pt-4">No leases are up for renewal in the next 90 days.</p>
                    ) : (
                        <div className="space-y-3">
                            {expiringLeases.map(({ tenant, unit, property, daysRemaining }) => (
                                <div key={tenant.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800">{tenant.name}</p>
                                        <p className="text-xs text-slate-500">{property?.address}, {unit.unit_number}</p>
                                        <p className="text-xs text-slate-500">Lease ends: {new Date(unit.lease_end).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`text-sm font-bold px-2 py-1 rounded-full ${getDaysRemainingColor(daysRemaining)}`}>
                                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                 <h2 className="text-xl font-bold text-slate-800 p-6">All Tenants</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Property / Unit</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Manage</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {tenants.map(tenant => {
                                const reminder = reminderMap.get(tenant.id);
                                const unit = tenant.unit_id ? unitMap.get(tenant.unit_id) : null;
                                const property = unit ? propertyMap.get(unit.property_id) : null;
                                
                                return (
                                    <tr key={tenant.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{tenant.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {property ? `${property.address}, ${unit?.unit_number}` : <span className="text-amber-600">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reminder?.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {reminder?.enabled ? 'On' : 'Off'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedTenant(tenant)} className="text-primary-600 hover:text-primary-900" disabled={!unit}>
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>

            {selectedTenant && (
                <ReminderSettingsModal
                    isOpen={!!selectedTenant}
                    onClose={() => setSelectedTenant(null)}
                    onSave={upsertReminder}
                    tenant={selectedTenant}
                    reminder={reminderMap.get(selectedTenant.id)}
                />
            )}

        </div>
    );
};
