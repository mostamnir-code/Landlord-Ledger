
import React, { useState, useMemo, useRef } from 'react';
import type { Tenant, Property, Unit } from '../types';
import { Modal } from './Modal';

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

const EmptyTenantsIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M42 38.5c4.6944 0 8.5-3.8056 8.5-8.5s-3.8056-8.5-8.5-8.5-8.5 3.8056-8.5 8.5 3.8056 8.5 8.5 8.5z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M57.5 70c0-8.56-6.94-15.5-15.5-15.5s-15.5 6.94-15.5 15.5h31z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M21 73.5V24.5L10.5 7h63L63 24.5v49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"/>
    </svg>
);

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
      if (!name || !email || !phone || !unitId) return;
      onAdd({ name, email, phone, unit_id: unitId });
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-slate-700">Assign to Unit</label>
          <select id="unitId" value={unitId} onChange={(e) => setUnitId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
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
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Tenant</button>
        </div>
      </form>
    );
};

const TenantCard: React.FC<{ tenant: Tenant; unit: Unit | undefined; property: Property | undefined; onSelect: () => void; }> = ({ tenant, unit, property, onSelect }) => (
    <div onClick={onSelect} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col cursor-pointer">
      <h3 className="text-lg font-bold text-primary-700">{tenant.name}</h3>
      <p className={`text-sm ${property ? 'text-slate-500' : 'text-amber-600'}`}>
          {property ? `${property.address}, ${unit?.unit_number}` : 'Unassigned'}
      </p>
      
      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm text-slate-600 flex-grow">
        <div className="flex items-center space-x-2">
          <AtSymbolIcon className="w-4 h-4 text-slate-400" />
          <a href={`mailto:${tenant.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary-600">{tenant.email}</a>
        </div>
        <div className="flex items-center space-x-2">
          <PhoneIcon className="w-4 h-4 text-slate-400" />
          <a href={`tel:${tenant.phone}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary-600">{tenant.phone}</a>
        </div>
      </div>
    </div>
);


interface TenantsProps {
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onSelectTenant: (tenantId: string) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'notes'>) => Promise<void>;
}

export const Tenants: React.FC<TenantsProps> = ({ tenants, properties, units, onSelectTenant, addTenant }) => {
    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p])), [properties]);
    const unitMap = useMemo(() => new Map(units.map(u => [u.id, u])), [units]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUnassigned, setShowUnassigned] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) return;
    
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headerLine = lines.shift()?.trim();
            if (!headerLine) {
                alert('CSV file is empty or missing a header row.');
                return;
            }
    
            const headers = headerLine.split(',').map(h => h.trim());
            const requiredHeaders = ['name', 'email', 'phone', 'property_address', 'unit_number'];
    
            const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));
            if (missingHeaders.length > 0) {
                alert(`CSV is missing required headers: ${missingHeaders.join(', ')}. Please use these headers and try again.`);
                return;
            }
    
            let errorCount = 0;
            const errorDetails: string[] = [];
            const tenantsToAdd: Omit<Tenant, 'id' | 'notes'>[] = [];
    
            for (const line of lines) {
                const values = line.split(',');
                const row: { [key: string]: string } = {};
                headers.forEach((header, i) => {
                    row[header] = values[i]?.trim();
                });
    
                const property = properties.find(p => p.address === row.property_address);
                const unit = units.find(u => u.property_id === property?.id && u.unit_number === row.unit_number);

                if (unit) {
                    if (row.name && row.email && row.phone) {
                        tenantsToAdd.push({
                            name: row.name,
                            email: row.email,
                            phone: row.phone,
                            unit_id: unit.id,
                        });
                    } else {
                        errorCount++;
                        errorDetails.push(`Skipping row with missing name, email, or phone: ${line}`);
                    }
                } else {
                    errorCount++;
                    errorDetails.push(`Could not find unit "${row.unit_number}" at property "${row.property_address}" for tenant "${row.name}".`);
                }
            }
    
            try {
                await Promise.all(tenantsToAdd.map(tenant => addTenant(tenant)));
            } catch (error) {
                console.error("Error during bulk tenant import:", error);
                let message = "An unexpected error occurred during the import process. Some tenants may not have been added.";
                if (error instanceof Error) {
                    message = `An error occurred: ${error.message}`;
                } else if (error && typeof error === 'object' && 'message' in error) {
                    message = `An error occurred: ${String((error as { message: unknown }).message)}`;
                }
                alert(message);
                return;
            }
    
            let summaryMessage = `Import Complete!\n\nSuccessfully imported: ${tenantsToAdd.length} tenants.`;
            if (errorCount > 0) {
                summaryMessage += `\nFailed or skipped: ${errorCount} records.`;
                summaryMessage += `\n\nErrors:\n- ${errorDetails.slice(0, 5).join('\n- ')}`;
                 if (errorDetails.length > 5) {
                    summaryMessage += `\n- ... and ${errorDetails.length - 5} more errors.`;
                }
            }
            alert(summaryMessage);
        };
    
        reader.onerror = () => {
            alert('Failed to read the file.');
        };
        
        reader.readAsText(file);
        
        if (event.target) {
            event.target.value = '';
        }
    };

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
                <h1 className="text-3xl font-bold text-slate-900">Tenants</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={handleImportClick}
                        className="flex items-center space-x-2 px-3 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
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
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div className="relative flex-grow max-w-xs">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, contact, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                        <label htmlFor="unassigned-filter" className="ml-2 block text-sm font-medium text-slate-700">
                            Show unassigned only
                        </label>
                    </div>
                </div>
            )}
            
            {tenants.length > 0 ? (
                filteredTenants.length > 0 ? (
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
                                onSelect={() => onSelectTenant(tenant.id)}
                            />
                        );
                    })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
                        <h3 className="text-lg font-medium text-slate-800">No Tenants Found</h3>
                        <p className="mt-1 text-sm text-slate-500">No tenants match your current filters.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
                    <EmptyTenantsIllustration className="mx-auto h-28 w-28" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800">No Tenants Found</h3>
                    <p className="mt-1 text-sm text-slate-500">{units.length > 0 ? "Add your first tenant using the button above." : "You must add a property and a unit before you can add a tenant."}</p>
                </div>
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Tenant">
                <AddTenantForm onAdd={addTenant} onClose={() => setIsAddModalOpen(false)} properties={properties} units={units} />
            </Modal>
        </div>
    );
};
