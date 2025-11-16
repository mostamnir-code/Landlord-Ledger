import React, { useState } from 'react';
import type { Property } from '../types';
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
  
const EmptyPropertiesIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M73.5 35L52.5 17.5V77H73.5V35Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M66.5 77V63C66.5 61.3431 65.1569 60 63.5 60H59.5C57.8431 60 56.5 61.3431 56.5 63V77" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400"/>
        <path d="M63 24.5L42 7L21 24.5V73.5H63V24.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"/>
        <path d="M49 73.5V56C49 53.7909 47.2091 52 45 52H39C36.7909 52 35 53.7909 35 56V73.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"/>
    </svg>
);

const PropertyCard: React.FC<{ property: Property; onDelete: () => void; }> = ({ property, onDelete }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col">
    <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-primary-700">{property.address}</h3>
        <button onClick={onDelete} className="text-slate-400 hover:text-red-600 p-1 rounded-full transition-colors" aria-label={`Delete property ${property.address}`}>
            <TrashIcon className="w-5 h-5" />
        </button>
    </div>
    <div className="mt-4 space-y-2 text-sm text-slate-600 flex-grow">
      <p><span className="font-semibold">Tenant:</span> {property.tenant}</p>
      <p><span className="font-semibold">Rent:</span> ${property.rent.toLocaleString()}/month</p>
      <p><span className="font-semibold">Lease End:</span> {new Date(property.leaseEnd).toLocaleDateString()}</p>
    </div>
  </div>
);

const AddPropertyForm: React.FC<{ onAdd: (property: Omit<Property, 'id'>) => void; onClose: () => void; }> = ({ onAdd, onClose }) => {
  const [address, setAddress] = useState('');
  const [tenant, setTenant] = useState('');
  const [rent, setRent] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !tenant || !rent || !leaseEnd) return;
    onAdd({ address, tenant, rent: parseFloat(rent), leaseEnd });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="tenant" className="block text-sm font-medium text-slate-700">Tenant Name</label>
        <input type="text" id="tenant" value={tenant} onChange={(e) => setTenant(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="rent" className="block text-sm font-medium text-slate-700">Monthly Rent</label>
        <input type="number" id="rent" value={rent} onChange={(e) => setRent(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="leaseEnd" className="block text-sm font-medium text-slate-700">Lease End Date</label>
        <input type="date" id="leaseEnd" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Property</button>
      </div>
    </form>
  );
};

interface PropertiesProps {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id'>) => void;
  deleteProperty: (propertyId: string) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ properties, addProperty, deleteProperty }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">My Properties</h1>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>Add Property</span>
        </button>
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => (
            <PropertyCard key={prop.id} property={prop} onDelete={() => setPropertyToDelete(prop)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-slate-200">
            <EmptyPropertiesIllustration className="mx-auto h-28 w-28" />
            <h3 className="mt-4 text-lg font-medium text-slate-800">No Properties Found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by adding your first property.</p>
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Property">
        <AddPropertyForm onAdd={addProperty} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={() => {
            if (propertyToDelete) {
                deleteProperty(propertyToDelete.id);
            }
        }}
        title="Delete Property?"
      >
        Are you sure you want to delete the property at "{propertyToDelete?.address}"? This will also delete all associated income and expense records. This action cannot be undone.
      </ConfirmModal>
    </div>
  );
};