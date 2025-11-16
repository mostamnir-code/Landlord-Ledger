
import React, { useState, useMemo, useRef } from 'react';
import type { Tenant, Property } from '../types';
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
  }> = ({ onAdd, onClose, properties }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !email || !phone || !propertyId) return;
      onAdd({ name, email, phone, property_id: propertyId });
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
          <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700">Assign to Property</label>
          <select id="propertyId" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
          </select>
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Tenant</button>
        </div>
      </form>
    );
};

const TenantCard: React.FC<{ tenant: Tenant; property: Property | undefined; onSelect: () => void; }> = ({ tenant, property, onSelect }) => (
  <div onClick={onSelect} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col cursor-pointer">
    <h3 className="text-lg font-bold text-primary-700">{tenant.name}</h3>
    <p className="text-sm text-slate-500">{property?.address || 'No property assigned'}</p>
    
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
  onSelectTenant: (tenantId: string) => void;
  addTenant: (tenant: Omit<Tenant, 'id' | 'notes'>) => Promise<void>;
}

export const Tenants: React.FC<TenantsProps> = ({ tenants, properties, onSelectTenant, addTenant }) => {
    const propertyMap = new Map(properties.map(p => [p.id, p]));
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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
            const requiredHeaders = ['name', 'email', 'phone', 'property_address'];
    
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
    
                if (property) {
                    if (row.name && row.email && row.phone) {
                        tenantsToAdd.push({
                            name: row.name,
                            email: row.email,
                            phone: row.phone,
                            property_id: property.id,
                        });
                    } else {
                        errorCount++;
                        errorDetails.push(`Skipping row with missing name, email, or phone: ${line}`);
                    }
                } else {
                    errorCount++;
                    errorDetails.push(`Could not find property with address "${row.property_address}" for tenant "${row.name}".`);
                }
            }
    
            try {
                await Promise.all(tenantsToAdd.map(tenant => addTenant(tenant)));
            } catch (error) {
                console.error("Error during bulk tenant import:", error);
                alert("An unexpected error occurred during the import process. Some tenants may not have been added.");
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
        if (!searchTerm) {
            return tenants;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return tenants.filter(tenant =>
            tenant.name.toLowerCase().includes(lowercasedFilter) ||
            tenant.email.toLowerCase().includes(lowercasedFilter) ||
            tenant.phone.toLowerCase().includes(lowercasedFilter)
        );
    }, [tenants, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-slate-900">Tenants</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-52 pl-10 pr-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
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
                        disabled={properties.length === 0}
                        title={properties.length === 0 ? "You must add a property before adding a tenant." : "Add a new tenant"}
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Tenant</span>
                    </button>
                </div>
            </div>
            
            {tenants.length > 0 ? (
                filteredTenants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenants.map(tenant => (
                        <TenantCard
                            key={tenant.id}
                            tenant={tenant}
                            property={propertyMap.get(tenant.property_id)}
                            onSelect={() => onSelectTenant(tenant.id)}
                        />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
                        <h3 className="text-lg font-medium text-slate-800">No Results Found</h3>
                        <p className="mt-1 text-sm text-slate-500">Your search for "{searchTerm}" did not match any tenants.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
                    <EmptyTenantsIllustration className="mx-auto h-28 w-28" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800">No Tenants Found</h3>
                    <p className="mt-1 text-sm text-slate-500">{properties.length > 0 ? "Add your first tenant using the button above." : "You must add a property before you can add a tenant."}</p>
                </div>
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Tenant">
                <AddTenantForm onAdd={addTenant} onClose={() => setIsAddModalOpen(false)} properties={properties} />
            </Modal>
        </div>
    );
};
