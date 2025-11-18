
import React, { useState, useMemo, useEffect } from 'react';
import type { BankConnection, SyncedTransaction, Property, Unit, Transaction } from '../types';
import { TransactionType, DefaultIncomeCategories, DefaultExpenseCategories } from '../types';
import { Modal } from './Modal';
import * as plaidClient from '../services/plaidClient';
import * as saltEdgeClient from '../services/saltEdgeClient';

// Declare Plaid and Salt Edge globals from their CDN scripts
declare const Plaid: any;
declare const SaltEdgeConnect: any;

// Icons
const BuildingLibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);
const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l-3.181 3.183A8.25 8.25 0 004.5 16.5l3.182-3.182" />
    </svg>
);
const GlobeAmericasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387 .775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.473.236 1.05.038 1.286-.431l.431-.862df.714-1.428a1.5 1.5 0 00-2.65-1.06l-1.899 1.899a1.5 1.5 0 01-2.121 0l-1.414-1.414a1.5 1.5 0 010-2.121l1.899-1.899a1.5 1.5 0 001.06-2.65l-1.428-.714a6 6 0 00-2.172-2.172L6.115 5.19z" />
    </svg>
);

// Interfaces for local state management
interface ReviewedTransaction extends Partial<SyncedTransaction> {
    property_id: string;
    unit_id: string | null;
    type: TransactionType;
    category: string;
}

interface BankSyncProps {
    properties: Property[];
    units: Unit[];
    bankConnections: BankConnection[];
    syncedTransactions: SyncedTransaction[];
    onAddConnection: (connection: BankConnection) => void;
    onSyncTransactions: (connection: BankConnection) => void;
    onImportTransactions: (transactions: (Omit<Transaction, 'id'> & { sync_id: string })[]) => void;
}

const categorySuggestions = [
    // Expenses
    { keywords: ['repair', 'fix', 'maintenance', 'plumbing', 'electrician', 'handyman', 'home depot', 'lowes'], category: 'Repairs', type: TransactionType.EXPENSE },
    { keywords: ['utility', 'electric', 'water', 'gas', 'internet', 'sewage', 'bill', 'pg&e'], category: 'Utilities', type: TransactionType.EXPENSE },
    { keywords: ['tax', 'property tax'], category: 'Property Tax', type: TransactionType.EXPENSE },
    { keywords: ['insurance', 'premium'], category: 'Insurance', type: TransactionType.EXPENSE },
    { keywords: ['tesco', 'waitrose', 'lidl'], category: 'Supplies', type: TransactionType.EXPENSE },
    // Income
    { keywords: ['rent', 'zelle', 'payment from', 'revolut transfer'], category: 'Rent', type: TransactionType.INCOME },
    { keywords: ['deposit', 'stripe transfer'], category: 'Other', type: TransactionType.INCOME },
];


const ProviderSelectionModal: React.FC<{onClose: () => void; onSelect: (provider: 'plaid' | 'saltedge') => void}> = ({onClose, onSelect}) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Connect Bank Account">
             <div className="space-y-4">
                <p className="text-center text-slate-600">Please select your bank's region to continue.</p>
                <button
                    onClick={() => onSelect('plaid')}
                    className="w-full flex items-center gap-4 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 text-left"
                >
                    <img src="https://cdn.plaid.com/brand/logo-blue.svg" alt="Plaid" className="h-8 w-auto"/>
                    <div>
                        <p className="font-semibold text-slate-800">United States</p>
                        <p className="text-sm text-slate-500">Powered by Plaid</p>
                    </div>
                </button>
                 <button
                    onClick={() => onSelect('saltedge')}
                    className="w-full flex items-center gap-4 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 text-left"
                >
                    <img src="https://www.saltedge.com/images/logo_se.svg" alt="Salt Edge" className="h-8 w-auto"/>
                    <div>
                        <p className="font-semibold text-slate-800">International</p>
                        <p className="text-sm text-slate-500">Powered by Salt Edge</p>
                    </div>
                </button>
            </div>
        </Modal>
    )
}

const TransactionReviewRow: React.FC<{
    transaction: SyncedTransaction;
    properties: Property[];
    units: Unit[];
    onUpdate: (updates: Partial<ReviewedTransaction>) => void;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ transaction, properties, units, onUpdate, isSelected, onSelect }) => {
    const [propertyId, setPropertyId] = useState('');
    const [unitId, setUnitId] = useState<string | null>(null);
    const [type, setType] = useState<TransactionType>(transaction.is_debit ? TransactionType.EXPENSE : TransactionType.INCOME);
    const [category, setCategory] = useState('');

    const availableUnits = useMemo(() => units.filter(u => u.property_id === propertyId), [units, propertyId]);
    const availableCategories = useMemo(() => (type === TransactionType.INCOME ? DefaultIncomeCategories : DefaultExpenseCategories), [type]);

    useEffect(() => {
        const lowercasedDescription = transaction.description.toLowerCase();
        for (const suggestion of categorySuggestions) {
            if (suggestion.keywords.some(keyword => lowercasedDescription.includes(keyword))) {
                setType(suggestion.type);
                setCategory(suggestion.category);
                return;
            }
        }
        // Fallback if no keywords match
        setCategory('');
    }, [transaction.description]);

    useEffect(() => {
        setCategory(prev => availableCategories.includes(prev as any) ? prev : '');
    }, [availableCategories]);

    useEffect(() => {
        onUpdate({
            property_id: propertyId,
            unit_id: unitId,
            type,
            category,
        });
    }, [propertyId, unitId, type, category, onUpdate]);

    return (
        <tr className={isSelected ? 'bg-primary-50' : 'bg-white'}>
            <td className="px-4 py-4"><input type="checkbox" checked={isSelected} onChange={onSelect} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"/></td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{transaction.description}</td>
            <td className={`px-2 py-4 whitespace-nowrap text-sm text-right font-semibold ${transaction.is_debit ? 'text-slate-700' : 'text-green-600'}`}>
                {transaction.is_debit ? '-' : '+'}${transaction.amount.toFixed(2)}
            </td>
            <td className="px-2 py-4 whitespace-nowrap">
                <select value={propertyId} onChange={e => { setPropertyId(e.target.value); setUnitId(null); }} className="w-full text-sm p-1 border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
                </select>
            </td>
            <td className="px-2 py-4 whitespace-nowrap">
                 <select value={unitId ?? ''} onChange={e => setUnitId(e.target.value || null)} disabled={!propertyId || availableUnits.length === 0} className="w-full text-sm p-1 border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50">
                    <option value="">Property-wide</option>
                    {availableUnits.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
                </select>
            </td>
            <td className="px-2 py-4 whitespace-nowrap">
                <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full text-sm p-1 border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                    <option value={TransactionType.INCOME}>Income</option>
                    <option value={TransactionType.EXPENSE}>Expense</option>
                </select>
            </td>
            <td className="px-2 py-4 whitespace-nowrap">
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full text-sm p-1 border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                     <option value="">Select</option>
                     {Array.from(availableCategories).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </td>
        </tr>
    );
}

export const BankSync: React.FC<BankSyncProps> = ({ properties, units, bankConnections, syncedTransactions, onAddConnection, onSyncTransactions, onImportTransactions }) => {
    const [isProviderSelectionOpen, setIsProviderSelectionOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);
    const [reviewedTxs, setReviewedTxs] = useState<Record<string, Partial<ReviewedTransaction>>>({});
    const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

    const handlePlaidSuccess = async (public_token: string, metadata: any) => {
        try {
            const { access_token } = await plaidClient.exchangePublicToken(public_token);
            const newConnection: BankConnection = {
                id: `plaid_${Date.now()}`,
                provider: 'plaid',
                institution_name: metadata.institution.name,
                access_token: access_token,
            };
            onAddConnection(newConnection);
        } catch (error) {
            console.error("Plaid token exchange failed:", error);
            alert("There was an error connecting your account via Plaid. Please try again.");
        }
    };

    const handlePlaidConnect = async () => {
        try {
            const { link_token } = await plaidClient.createLinkToken();
            const handler = Plaid.create({
                token: link_token,
                onSuccess: handlePlaidSuccess,
            });
            handler.open();
        } catch (error) {
            console.error("Could not create Plaid link token:", error);
            alert("Could not initialize Plaid connection. Please try again later.");
        }
    };

    const handleSaltEdgeConnect = async () => {
        try {
            const { connect_token } = await saltEdgeClient.createConnectToken();
            const connect = new SaltEdgeConnect({
                token: connect_token,
                onSuccess: (data: any) => {
                    const newConnection: BankConnection = {
                        id: `se_${data.connection_id}`,
                        provider: 'saltedge',
                        institution_name: data.provider_name,
                        connection_id: data.connection_id,
                    };
                    onAddConnection(newConnection);
                },
                onError: (error: any) => {
                    console.error("Salt Edge connection error:", error);
                    alert(`An error occurred with Salt Edge: ${error.error_message || 'Please try again.'}`);
                }
            });
            connect.show();
        } catch (error) {
            console.error("Could not create Salt Edge connect token:", error);
            alert("Could not initialize Salt Edge connection. Please try again later.");
        }
    };
    
    const handleProviderSelect = (provider: 'plaid' | 'saltedge') => {
        setIsProviderSelectionOpen(false);
        if (provider === 'plaid') {
            handlePlaidConnect();
        } else {
            handleSaltEdgeConnect();
        }
    };

    const handleUpdateReview = (txId: string, updates: Partial<ReviewedTransaction>) => {
        setReviewedTxs(prev => ({ ...prev, [txId]: { ...(prev[txId] || {}), ...updates } }));
    };

    const handleSelectTx = (txId: string) => {
        setSelectedTxIds(prev => {
            const newSet = new Set(prev);
            newSet.has(txId) ? newSet.delete(txId) : newSet.add(txId);
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTxIds(e.target.checked ? new Set(syncedTransactions.map(t => t.id)) : new Set());
    };
    
    const handleImport = () => {
        const toImport: (Omit<Transaction, 'id'> & { sync_id: string })[] = [];
        const errors: string[] = [];
        
        selectedTxIds.forEach(id => {
            const originalTx = syncedTransactions.find(t => t.id === id);
            const reviewData = reviewedTxs[id];

            if (!originalTx || !reviewData?.property_id || !reviewData?.category || !reviewData?.type) {
                errors.push(originalTx?.description || `Transaction ID ${id}`);
                return;
            }
            
            toImport.push({
                sync_id: id,
                property_id: reviewData.property_id,
                unit_id: reviewData.unit_id || null,
                type: reviewData.type,
                description: originalTx.description,
                amount: originalTx.amount,
                date: originalTx.date,
                category: reviewData.category,
            });
        });

        if (errors.length > 0) {
            alert(`${errors.length} selected transaction(s) are missing required information (Property, Type, Category) and will not be imported.\n\nMissing info for:\n- ${errors.join('\n- ')}`);
        }

        if (toImport.length > 0) {
            onImportTransactions(toImport);
            setSelectedTxIds(new Set());
        }
    };

    const handleSync = (connection: BankConnection) => {
        setIsSyncing(connection.id);
        setTimeout(() => {
            onSyncTransactions(connection);
            setIsSyncing(null);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Bank Sync</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Connected Accounts</h2>
                        <p className="text-slate-500 text-sm">Sync transactions from your bank to easily track income and expenses.</p>
                    </div>
                    <button onClick={() => setIsProviderSelectionOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold text-sm">Connect Account</button>
                </div>
                <div className="mt-6 space-y-4">
                    {bankConnections.length > 0 ? (
                        bankConnections.map(conn => (
                            <div key={conn.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-100 p-3 rounded-md"><BuildingLibraryIcon className="w-6 h-6 text-primary-600"/></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{conn.institution_name}</h3>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">{conn.provider}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleSync(conn)} disabled={!!isSyncing} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-semibold text-sm disabled:opacity-50">
                                    <ArrowPathIcon className={`w-5 h-5 ${isSyncing === conn.id ? 'animate-spin' : ''}`}/>
                                    {isSyncing === conn.id ? 'Syncing...' : 'Sync Now'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-6">No bank accounts connected yet.</p>
                    )}
                </div>
            </div>

            {syncedTransactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-md">
                     <div className="flex justify-between items-center p-6 border-b border-slate-200">
                         <h2 className="text-xl font-bold text-slate-800">Transactions to Review ({selectedTxIds.size} selected)</h2>
                         <button onClick={handleImport} disabled={selectedTxIds.size === 0} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-sm hover:bg-green-700 disabled:bg-green-300">
                            Import Selected
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3"><input type="checkbox" onChange={handleSelectAll} checked={selectedTxIds.size > 0 && selectedTxIds.size === syncedTransactions.length} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"/></th>
                                    {['Date', 'Description', 'Amount', 'Property', 'Unit', 'Type', 'Category'].map(header => (
                                        <th key={header} scope="col" className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {syncedTransactions.map(tx => (
                                    <TransactionReviewRow 
                                        key={tx.id}
                                        transaction={tx}
                                        properties={properties}
                                        units={units}
                                        isSelected={selectedTxIds.has(tx.id)}
                                        onSelect={() => handleSelectTx(tx.id)}
                                        onUpdate={(updates) => handleUpdateReview(tx.id, { ...updates, id: tx.id })}
                                    />
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
            
            {isProviderSelectionOpen && <ProviderSelectionModal onClose={() => setIsProviderSelectionOpen(false)} onSelect={handleProviderSelect}/>}
        </div>
    );
}