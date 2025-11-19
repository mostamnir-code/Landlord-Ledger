
import React, { useState, useMemo, useRef } from 'react';
import type { Tenant, Property, Unit, Transaction } from '../types';
import { Modal } from './Modal';
import { TransactionType } from '../types';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);

const ArrowUpTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
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

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const EmptyTenantsIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M42 38.5c4.6944 0 8.5-3.8056 8.5-8.5s-3.8056-8.5-8.5-8.5-8.5 3.8056-8.5 8.5 3.8056 8.5 8.5 8.5z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M57.5 70c0-8.56-6.94-15.5-15.5-15.5s-15.5 6.94-15.5 15.5h31z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M21 73.5V24.5L10.5 7h63L63 24.5v49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"/>
    </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const ExclamationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const Squares2X2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);
  
const Bars4Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

// Helper interface for the preview
interface ImportTenantPreview {
    id: string; // temp id for list management
    name: string;
    email: string;
    phone: string;
    property_address: string;
    unit_number: string;
    validation_error?: string;
}

const AddTenantForm: React.FC<{ 
    onAdd: (tenant: Omit<Tenant, 'id' | 'notes'>) => void; 
    onClose: () => void; 
    properties: Property[];
    units: Unit[];
  }> = ({ onAdd, onClose, properties, units }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [unitId, setUnitId] = useState(units[0]?.id || '');

    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name) return; // Minimal validation
      onAdd({ name, email, phone, unit_id: unitId || null });
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assign to Unit</label>
          <select id="unitId" value={unitId} onChange={(e) => setUnitId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
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
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Tenant</button>
        </div>
      </form>
    );
};

const TenantCard: React.FC<{ tenant: Tenant; unit: Unit | undefined; property: Property | undefined; onSelect: () => void; rentStatus: 'paid' | 'overdue' | 'pending' | 'none'; }> = ({ tenant, unit, property, onSelect, rentStatus }) => {
    
    let statusIcon = null;
    let statusTitle = "";

    if (rentStatus === 'paid') {
        statusIcon = <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        statusTitle = "Rent Paid for Current Month";
    } else if (rentStatus === 'overdue') {
        statusIcon = <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
        statusTitle = "Rent Overdue";
    } else if (rentStatus === 'pending') {
        statusIcon = <ClockIcon className="w-5 h-5 text-amber-500" />;
        statusTitle = "Awaiting Payment";
    }
    
    return (
        <div onClick={onSelect} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col cursor-pointer">
          <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{tenant.name}</h3>
                   {statusIcon && <span title={statusTitle}>{statusIcon}</span>}
              </div>
          </div>
          <p className={`text-sm ${property ? 'text-slate-500 dark:text-slate-400' : 'text-amber-600 dark:text-amber-500'}`}>
              {property ? `${property.address}, ${unit?.unit_number}` : 'Unassigned'}
          </p>
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm text-slate-600 dark:text-slate-400 flex-grow">
            <div className="flex items-center space-x-2">
              <AtSymbolIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <a href={`mailto:${tenant.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary-600 dark:hover:text-primary-400">{tenant.email || 'N/A'}</a>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <a href={`tel:${tenant.phone}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary-600 dark:hover:text-primary-400">{tenant.phone || 'N/A'}</a>
            </div>
          </div>
        </div>
    );
};


interface TenantsProps {
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  transactions: Transaction[];
  onSelectTenant: (tenantId: string) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'notes'>) => Promise<void>;
}

export const Tenants: React.FC<TenantsProps> = ({ tenants, properties, units, transactions, onSelectTenant, addTenant }) => {
    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
    const unitMap = useMemo(() => new Map(units.map(u => [u.id, u])), [units]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUnassigned, setShowUnassigned] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CSV Import State
    const [importPreview, setImportPreview] = useState<ImportTenantPreview[]>([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;
    
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            let dataLines = lines;
            let hasHeader = false;
            
            if (lines.length > 0 && (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('email'))) {
                hasHeader = true;
                dataLines = lines.slice(1);
            }

            const parsedPreview: ImportTenantPreview[] = dataLines.map((line, index) => {
                const values = line.split(',').map(v => v.trim());
                return {
                    id: `row-${index}-${Date.now()}`,
                    name: values[0] || '',
                    email: values[1] || '',
                    phone: values[2] || '',
                    property_address: values[3] || '',
                    unit_number: values[4] || '',
                };
            });

            setImportPreview(parsedPreview);
            setIsImportModalOpen(true);
        };
    
        reader.onerror = () => {
            alert('Failed to read the file.');
        };
        
        reader.readAsText(file);
        if (event.target) event.target.value = '';
    };

    const handlePreviewChange = (id: string, field: keyof ImportTenantPreview, value: string) => {
        setImportPreview(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleRemovePreviewRow = (id: string) => {
        setImportPreview(prev => prev.filter(item => item.id !== id));
    };

    const handleFinalImport = async () => {
        if (importPreview.length === 0) return;

        let successCount = 0;
        let failCount = 0;

        for (const row of importPreview) {
            if (!row.name) {
                failCount++;
                continue; 
            }

            let unitId = null;
            if (row.property_address && row.unit_number) {
                const property = properties.find(p => 
                    p.address.toLowerCase().includes(row.property_address.toLowerCase()) || 
                    row.property_address.toLowerCase().includes(p.address.toLowerCase())
                );
                
                if (property) {
                    const unit = units.find(u => 
                        u.property_id === property.id && 
                        u.unit_number.toLowerCase() === row.unit_number.toLowerCase()
                    );
                    if (unit) unitId = unit.id;
                }
            }

            try {
                await addTenant({
                    name: row.name,
                    email: row.email || '', 
                    phone: row.phone || '',
                    unit_id: unitId,
                });
                successCount++;
            } catch (e) {
                console.error(e);
                failCount++;
            }
        }

        alert(`Import Complete.\nSuccessfully imported: ${successCount}\nSkipped/Failed: ${failCount}`);
        setIsImportModalOpen(false);
        setImportPreview([]);
    };

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const tenantRentStatus = useMemo(() => {
        const statusMap: Record<string, 'paid' | 'overdue' | 'pending' | 'none'> = {};
        tenants.forEach(tenant => {
            if (!tenant.unit_id) {
                statusMap[tenant.id] = 'none';
                return;
            }
            const unit = unitMap.get(tenant.unit_id);
            if (!unit) {
                statusMap[tenant.id] = 'none';
                return;
            }

            const rentPaid = transactions
                .filter(t => t.unit_id === tenant.unit_id && t.type === TransactionType.INCOME && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                .reduce((sum, t) => sum + t.amount, 0);

            if (rentPaid >= unit.rent) {
                statusMap[tenant.id] = 'paid';
            } else if (today.getDate() > 5 && rentPaid < unit.rent) {
                statusMap[tenant.id] = 'overdue';
            } else {
                statusMap[tenant.id] = 'pending';
            }
        });
        return statusMap;
    }, [tenants, units, transactions, unitMap, currentMonth, currentYear, today]);

    const filteredTenants = useMemo(() => {
        let tenantsToFilter = tenants;

        if (showUnassigned) {
            tenantsToFilter = tenants.filter(tenant => !tenant.unit_id);
        }

        if (!searchTerm) {
            return tenantsToFilter;
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        return tenantsToFilter.filter(tenant => {
            const unit = tenant.unit_id ? unitMap.get(tenant.unit_id) : undefined;
            const property = unit ? propertyMap.get(unit.property_id) : undefined;
            const address = property ? `${property.address} ${unit?.unit_number}` : '';

            return tenant.name.toLowerCase().includes(lowercasedFilter) ||
                   tenant.email.toLowerCase().includes(lowercasedFilter) ||
                   tenant.phone.toLowerCase().includes(lowercasedFilter) ||
                   address.toLowerCase().includes(lowercasedFilter);
        });
    }, [tenants, searchTerm, showUnassigned, propertyMap, unitMap]);


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tenants</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={handleImportClick}
                        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Import tenants from a CSV file"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Import CSV</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv"
                        className="hidden"
                    />
                    <button 
                        onClick={() => setIsAddModalOpen(true)} 
                        className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed"
                        disabled={units.length === 0}
                        title={units.length === 0 ? "You must add a unit before adding a tenant." : "Add a new tenant"}
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Tenant</span>
                    </button>
                </div>
            </div>

            {(tenants.length > 0) && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="Grid View"
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            title="List View"
                        >
                            <Bars4Icon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative flex-grow max-w-xs">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, contact, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="unassigned-filter"
                            checked={showUnassigned}
                            onChange={(e) => setShowUnassigned(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="unassigned-filter" className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Show unassigned only
                        </label>
                    </div>
                </div>
            )}
            
            {tenants.length > 0 ? (
                filteredTenants.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTenants.map(tenant => {
                            const unit = tenant.unit_id ? unitMap.get(tenant.unit_id) : undefined;
                            const property = unit ? propertyMap.get(unit.property_id) : undefined;
                            return (
                                <TenantCard
                                    key={tenant.id}
                                    tenant={tenant}
                                    unit={unit}
                                    property={property}
                                    rentStatus={tenantRentStatus[tenant.id] || 'none'}
                                    onSelect={() => onSelectTenant(tenant.id)}
                                />
                            );
                        })}
                        </div>
                    ) : (
                         <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Assigned Unit</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rent Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredTenants.map(tenant => {
                                        const unit = tenant.unit_id ? unitMap.get(tenant.unit_id) : undefined;
                                        const property = unit ? propertyMap.get(unit.property_id) : undefined;
                                        const rentStatus = tenantRentStatus[tenant.id] || 'none';

                                        let statusBadge = null;
                                        if (rentStatus === 'paid') {
                                            statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Paid</span>;
                                        } else if (rentStatus === 'overdue') {
                                            statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Overdue</span>;
                                        } else if (rentStatus === 'pending') {
                                            statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Pending</span>;
                                        }

                                        return (
                                            <tr 
                                                key={tenant.id} 
                                                onClick={() => onSelectTenant(tenant.id)}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{tenant.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col">
                                                        <span>{tenant.email || '-'}</span>
                                                        <span>{tenant.phone || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="text-sm text-slate-500 dark:text-slate-400">
                                                        {property ? `${property.address}, ${unit?.unit_number}` : <span className="text-amber-600 dark:text-amber-500">Unassigned</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {statusBadge}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectTenant(tenant.id);
                                                        }}
                                                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                                    >
                                                        Manage
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-white">No Tenants Found</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No tenants match your current filters.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <EmptyTenantsIllustration className="mx-auto h-28 w-28" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">No Tenants Found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{units.length > 0 ? "Add your first tenant using the button above." : "You must add a property and a unit before you can add a tenant."}</p>
                </div>
            )}

            {/* Add Tenant Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Tenant">
                <AddTenantForm onAdd={addTenant} onClose={() => setIsAddModalOpen(false)} properties={properties} units={units} />
            </Modal>

            {/* CSV Import Preview Modal */}
            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Review Import Data">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Please review and edit the data below before importing. Rows with existing properties/units will be automatically assigned. Empty fields are allowed.
                    </p>
                    <div className="overflow-x-auto max-h-[60vh] rounded border border-slate-200 dark:border-slate-700">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Email</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Phone</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Property Address</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Unit</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {importPreview.map(row => (
                                    <tr key={row.id}>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={row.name} 
                                                onChange={(e) => handlePreviewChange(row.id, 'name', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                                                placeholder="Required"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={row.email} 
                                                onChange={(e) => handlePreviewChange(row.id, 'email', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={row.phone} 
                                                onChange={(e) => handlePreviewChange(row.id, 'phone', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={row.property_address} 
                                                onChange={(e) => handlePreviewChange(row.id, 'property_address', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={row.unit_number} 
                                                onChange={(e) => handlePreviewChange(row.id, 'unit_number', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <button onClick={() => handleRemovePreviewRow(row.id)} className="text-red-600 hover:text-red-800">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button onClick={() => setIsImportModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                        <button onClick={handleFinalImport} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Import {importPreview.length} Tenants</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
