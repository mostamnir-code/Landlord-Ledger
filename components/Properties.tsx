
import React, { useState, useRef, useMemo } from 'react';
import type { Property, Unit } from '../types';
import { Modal } from './Modal';
import { ConfirmModal } from './ConfirmModal';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
  
const ArrowUpTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
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

const EmptyPropertiesIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M73.5 35L52.5 17.5V77H73.5V35Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M66.5 77V63C66.5 61.3431 65.1569 60 63.5 60H59.5C57.8431 60 56.5 61.3431 56.5 63V77" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M63 24.5L42 7L21 24.5V73.5H63V24.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"/>
        <path d="M49 73.5V56C49 53.7909 47.2091 52 45 52H39C36.7909 52 35 53.7909 35 56V73.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-600"/>
    </svg>
);

const PropertyCard: React.FC<{ property: Property; unitCount: number; onDelete: () => void; onSelect: () => void; }> = ({ property, unitCount, onDelete, onSelect }) => (
  <div onClick={onSelect} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all flex flex-col cursor-pointer">
    <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{property.address}</h3>
        <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
            className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 p-1 rounded-full transition-colors"
            aria-label={`Delete property ${property.address}`}
        >
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
    <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400 flex-grow">
      <p><span className="font-semibold text-slate-800 dark:text-slate-200">{unitCount}</span> {unitCount === 1 ? 'Unit' : 'Units'}</p>
    </div>
  </div>
);

const AddPropertyForm: React.FC<{ onAdd: (property: Omit<Property, 'id' | 'notes'>) => void; onAddBulk: (properties: Omit<Property, 'id' | 'notes'>[]) => void; onClose: () => void; }> = ({ onAdd, onAddBulk, onClose }) => {
  const [address, setAddress] = useState('');
  const [bulkAddresses, setBulkAddresses] = useState('');
  const [isBulk, setIsBulk] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulk) {
        const addresses = bulkAddresses.split('\n').map(a => a.trim()).filter(a => a.length > 0);
        if (addresses.length > 0) {
            onAddBulk(addresses.map(addr => ({ address: addr })));
            onClose();
        }
    } else {
        if (!address) return;
        onAdd({ address });
        onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-end mb-2">
        <button 
            type="button" 
            onClick={() => setIsBulk(!isBulk)} 
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
        >
            {isBulk ? "Switch to Single Entry" : "Switch to Bulk Entry (Text)"}
        </button>
      </div>

      {isBulk ? (
          <div>
            <label htmlFor="bulkAddresses" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Property Addresses (One per line)</label>
            <textarea 
                id="bulkAddresses" 
                value={bulkAddresses} 
                onChange={(e) => setBulkAddresses(e.target.value)} 
                required 
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500" 
                placeholder="123 Main St, Anytown, USA&#10;456 Elm St, Anytown, USA" 
            />
          </div>
      ) : (
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Property Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500" placeholder="e.g., 123 Main St, Anytown, USA" />
          </div>
      )}

      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{isBulk ? 'Add Properties' : 'Add Property'}</button>
      </div>
    </form>
  );
};

interface PropertiesProps {
  properties: Property[];
  units: Unit[];
  addProperty: (property: Omit<Property, 'id' | 'notes'>) => void;
  addPropertiesBulk: (properties: Omit<Property, 'id' | 'notes'>[]) => Promise<void>;
  deleteProperty: (propertyId: string) => void;
  onSelectProperty: (propertyId: string) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ properties, units, addProperty, addPropertiesBulk, deleteProperty, onSelectProperty }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unitCounts = useMemo(() => properties.reduce((acc, property) => {
    acc[property.id] = units.filter(u => u.property_id === property.id).length;
    return acc;
  }, {} as Record<string, number>), [properties, units]);

  const filteredProperties = useMemo(() => {
      if (!searchTerm) return properties;
      return properties.filter(p => p.address.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [properties, searchTerm]);

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
          if (lines.length === 0) return;

          const headerLine = lines[0].toLowerCase();
          const hasHeader = headerLine.includes('address');
          
          const dataRows = hasHeader ? lines.slice(1) : lines;
          
          let addressIndex = 0;
          if (hasHeader) {
              const headers = headerLine.split(',').map(h => h.trim());
              const idx = headers.findIndex(h => h.includes('address'));
              if (idx !== -1) addressIndex = idx;
          }

          const propertiesToAdd: { address: string }[] = [];
          const errors: string[] = [];

          dataRows.forEach(line => {
              const cols = line.split(',');
              const address = cols[addressIndex]?.trim();
              
              if (address) {
                  if (!properties.some(p => p.address.toLowerCase() === address.toLowerCase())) {
                       propertiesToAdd.push({ address: address.replace(/^"|"$/g, '') });
                  } else {
                      errors.push(`Duplicate skipped: ${address}`);
                  }
              }
          });

          if (propertiesToAdd.length > 0) {
              try {
                  await addPropertiesBulk(propertiesToAdd);
                  let msg = `Successfully imported ${propertiesToAdd.length} properties.`;
                  if (errors.length > 0) msg += `\n\n${errors.length} duplicates were skipped.`;
                  alert(msg);
              } catch (err) {
                  alert("Error importing properties. Please try again.");
              }
          } else {
              alert("No valid new properties found in CSV.");
          }
      };
      
      reader.readAsText(file);
      if (event.target) event.target.value = ''; // Reset
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Properties</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1 shadow-sm">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title="Grid View"
                >
                    <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    title="List View"
                >
                    <Bars4Icon className="w-5 h-5" />
                </button>
            </div>
            
            <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />

            <div className="flex gap-2">
                 <button
                    onClick={handleImportClick}
                    className="flex items-center justify-center px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    title="Import properties from a CSV file"
                >
                    <ArrowUpTrayIcon className="w-5 h-5" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    className="hidden"
                />
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors whitespace-nowrap">
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Property</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>
        </div>
      </div>
      
      {filteredProperties.length > 0 ? (
        viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(prop => (
                <PropertyCard
                key={prop.id}
                property={prop}
                unitCount={unitCounts[prop.id] || 0}
                onDelete={() => setPropertyToDelete(prop)}
                onSelect={() => onSelectProperty(prop.id)}
                />
            ))}
            </div>
        ) : (
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Address</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Units</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredProperties.map(prop => (
                            <tr 
                                key={prop.id} 
                                onClick={() => onSelectProperty(prop.id)}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                    {prop.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        {unitCounts[prop.id] || 0} Units
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPropertyToDelete(prop);
                                        }}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-dashed border-slate-200 dark:border-slate-700">
            {searchTerm ? (
                 <>
                    <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-white">No Matches Found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search.</p>
                 </>
            ) : (
                <>
                    <EmptyPropertiesIllustration className="mx-auto h-28 w-28" />
                    <h3 className="mt-4 text-lg font-medium text-slate-800 dark:text-white">No Properties Found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by adding your first property.</p>
                </>
            )}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Property">
        <AddPropertyForm onAdd={addProperty} onAddBulk={addPropertiesBulk} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={() => {
            if (propertyToDelete) {
                deleteProperty(propertyToDelete.id);
                setPropertyToDelete(null);
            }
        }}
        title="Delete Property?"
      >
        Are you sure you want to delete the property at "{propertyToDelete?.address}"? This will also delete all associated units and income/expense records. This action cannot be undone.
      </ConfirmModal>
    </div>
  );
};
