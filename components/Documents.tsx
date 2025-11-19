
import React, { useState, useMemo } from 'react';
import type { Document, Property, Unit, Tenant } from '../types';
import { DocumentTypes } from '../types';
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

const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const UploadDocumentForm: React.FC<{
    onUpload: (file: File, metadata: Omit<Document, 'id' | 'created_at' | 'file_path' | 'file_name' | 'file_size' | 'file_type'>) => void;
    onClose: () => void;
    properties: Property[];
    units: Unit[];
    tenants: Tenant[];
}> = ({ onUpload, onClose, properties, units, tenants }) => {
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<string>(DocumentTypes[0]);
    const [associationType, setAssociationType] = useState<'property' | 'tenant' | 'general'>('general');
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [unitId, setUnitId] = useState<string | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const availableUnits = useMemo(() => units.filter(u => u.property_id === propertyId), [units, propertyId]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        
        // Reset state on new selection
        setFile(null);
        setError(null);
        
        if (!selectedFile) {
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Invalid file type. Only JPEG and PDF files are allowed.');
            return;
        }

        // Validate file size (3MB limit)
        const maxSizeInBytes = 3 * 1024 * 1024;
        if (selectedFile.size > maxSizeInBytes) {
            setError(`File is too large (max 3 MB). Your file is ${formatBytes(selectedFile.size)}.`);
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        if (error) return; // Don't submit if there's a validation error from handleFileChange

        const metadata = {
            property_id: associationType === 'property' ? propertyId : null,
            unit_id: associationType === 'property' ? unitId : null,
            tenant_id: associationType === 'tenant' ? tenantId : null,
            document_type: documentType,
            description: description || null,
        };

        onUpload(file, metadata);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">File</label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                        <DocumentIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg,application/pdf" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        {file && !error ? <p className="text-sm text-slate-500">{file.name}</p> : <p className="text-xs text-slate-500">JPEG or PDF, up to 3MB</p>}
                    </div>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-slate-700">Document Type</label>
                    <select id="documentType" value={documentType} onChange={e => setDocumentType(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        {DocumentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="associationType" className="block text-sm font-medium text-slate-700">Associate With</label>
                    <select id="associationType" value={associationType} onChange={e => { setAssociationType(e.target.value as any); setPropertyId(null); setUnitId(null); setTenantId(null); }} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="general">General (No Association)</option>
                        <option value="property">Property / Unit</option>
                        <option value="tenant">Tenant</option>
                    </select>
                </div>
            </div>

            {associationType === 'property' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700">Property</label>
                        <select id="propertyId" value={propertyId ?? ''} onChange={e => {setPropertyId(e.target.value); setUnitId(null);}} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                            <option value="">Select a property</option>
                            {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="unitId" className="block text-sm font-medium text-slate-700">Unit (Optional)</label>
                        <select id="unitId" value={unitId ?? ''} onChange={e => setUnitId(e.target.value)} disabled={!propertyId || availableUnits.length === 0} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-slate-50">
                            <option value="">Select a unit</option>
                            {availableUnits.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
                        </select>
                    </div>
                </div>
            )}
            
            {associationType === 'tenant' && (
                <div>
                    <label htmlFor="tenantId" className="block text-sm font-medium text-slate-700">Tenant</label>
                    <select id="tenantId" value={tenantId ?? ''} onChange={e => setTenantId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="">Select a tenant</option>
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>

            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Upload</button>
            </div>
        </form>
    );
}

interface DocumentsProps {
    documents: Document[];
    properties: Property[];
    units: Unit[];
    tenants: Tenant[];
    onUpload: (file: File, metadata: Omit<Document, 'id' | 'created_at' | 'file_path' | 'file_name' | 'file_size' | 'file_type'>) => Promise<void>;
    onDelete: (document: Document) => Promise<void>;
    onDownload: (document: Document) => Promise<void>;
}

export const Documents: React.FC<DocumentsProps> = ({ documents, properties, units, tenants, onUpload, onDelete, onDownload }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);

    const propertyMap = useMemo(() => new Map(properties.map(p => [p.id, p.address])), [properties]);
    const unitMap = useMemo(() => new Map(units.map(u => [u.id, u.unit_number])), [units]);
    const tenantMap = useMemo(() => new Map(tenants.map(t => [t.id, t.name])), [tenants]);

    const getAssociationText = (doc: Document) => {
        if (doc.tenant_id) {
            return `Tenant: ${tenantMap.get(doc.tenant_id) || 'Unknown'}`;
        }
        if (doc.property_id) {
            const propAddress = propertyMap.get(doc.property_id) || 'Unknown';
            if (doc.unit_id) {
                const unitNum = unitMap.get(doc.unit_id) || 'Unknown';
                return `${propAddress}, Unit ${unitNum}`;
            }
            return `Property: ${propAddress}`;
        }
        return 'General';
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
                <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Upload Document</span>
                </button>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Associated With</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Added</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Size</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {documents.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-slate-500">No documents uploaded yet.</td></tr>
                        ) : (
                            documents.map(doc => (
                                <tr key={doc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-700">{doc.file_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.document_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getAssociationText(doc)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatBytes(doc.file_size)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => onDownload(doc)} className="text-primary-600 hover:text-primary-900 p-1" title="Download">
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setDocToDelete(doc)} className="text-red-600 hover:text-red-900 p-1" title="Delete">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload a New Document">
                <UploadDocumentForm 
                    onUpload={async (file, metadata) => {
                        try {
                            await onUpload(file, metadata);
                        } catch (error) {
                            alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
                        }
                    }} 
                    onClose={() => setIsUploadModalOpen(false)}
                    properties={properties}
                    units={units}
                    tenants={tenants}
                />
            </Modal>
            
            <ConfirmModal
                isOpen={!!docToDelete}
                onClose={() => setDocToDelete(null)}
                onConfirm={() => {
                    if (docToDelete) {
                        onDelete(docToDelete);
                        setDocToDelete(null);
                    }
                }}
                title="Delete Document?"
            >
                Are you sure you want to delete "{docToDelete?.file_name}"? This action cannot be undone.
            </ConfirmModal>
        </div>
    );
};