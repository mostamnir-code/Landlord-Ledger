
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Property, Unit, Tenant, Transaction, Document, Reminder, RecurringTransaction, BankConnection, SyncedTransaction, PaymentSettings } from '../types';

export function useData(user: any) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
    const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
    const [syncedTransactions, setSyncedTransactions] = useState<SyncedTransaction[]>([]);
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({ stripe_connected: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleError = (error: any, message: string) => {
        console.error(message, error);
        setError(message);
    };

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [ 
                { data: propertiesData, error: propertiesError },
                { data: unitsData, error: unitsError },
                { data: tenantsData, error: tenantsError },
                { data: transactionsData, error: transactionsError },
                // ... fetch other data ...
            ] = await Promise.all([
                supabase.from('properties').select('*'),
                supabase.from('units').select('*'),
                supabase.from('tenants').select('*'),
                supabase.from('transactions').select('*'),
                // ... other supabase fetch calls ...
            ]);

            if (propertiesError) handleError(propertiesError, 'Error fetching properties'); else setProperties(propertiesData as Property[]);
            if (unitsError) handleError(unitsError, 'Error fetching units'); else setUnits(unitsData as Unit[]);
            if (tenantsError) handleError(tenantsError, 'Error fetching tenants'); else setTenants(tenantsData as Tenant[]);
            if (transactionsError) handleError(transactionsError, 'Error fetching transactions'); else setTransactions(transactionsData as Transaction[]);

        } catch (error) {
            handleError(error, 'Error fetching data');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    

    // --- Properties ---
    const addProperty = async (propertyData: Omit<Property, 'id'>) => {
        const { data, error } = await supabase.from('properties').insert([propertyData]).select();
        if (error) handleError(error, 'Error adding property');
        else setProperties(prev => [...prev, data[0]]);
        return data ? data[0] : null;
    };
    
    // --- Units ---
    const addUnit = async (unitData: Omit<Unit, 'id'>) => {
        const { data, error } = await supabase.from('units').insert([unitData]).select();
        if (error) handleError(error, 'Error adding unit');
        else setUnits(prev => [...prev, data[0]]);
        return data ? data[0] : null;
    };

    // --- Tenants ---
    const addTenant = async (tenantData: Omit<Tenant, 'id'>) => {
        const { data, error } = await supabase.from('tenants').insert([tenantData]).select();
        if (error) handleError(error, 'Error adding tenant');
        else setTenants(prev => [...prev, data[0]]);
        return data ? data[0] : null;
    };

    // --- Transactions ---
    const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
        const { data, error } = await supabase.from('transactions').insert([txData]).select();
        if (error) handleError(error, 'Error adding transaction');
        else setTransactions(prev => [...prev, data[0]]);
        return data ? data[0] : null;
    };

    return {
        loading,
        error,
        properties, addProperty, setProperties, 
        units, addUnit, setUnits,
        tenants, addTenant, setTenants,
        transactions, addTransaction, setTransactions,
        documents, setDocuments, // Mocked for now
        reminders, setReminders, // Mocked for now
        recurringTransactions, setRecurringTransactions, // Mocked for now
        bankConnections, setBankConnections, // Mocked for now
        syncedTransactions, setSyncedTransactions, // Mocked for now
        paymentSettings, setPaymentSettings, // Mocked for now
    };
}
