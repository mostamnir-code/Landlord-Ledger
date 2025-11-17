
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Properties } from './components/Properties';
import { TransactionsView } from './components/TransactionsView';
import { PropertyDetail } from './components/PropertyDetail';
import { Tenants } from './components/Tenants';
import { TenantDetail } from './components/TenantDetail';
import { Reminders } from './components/Reminders';
import { Documents } from './components/Documents';
import { AIAssistant } from './components/AIAssistant';
import { Auth } from './components/Auth';
import { OnlinePayments } from './components/OnlinePayments';
import { Settings } from './components/Settings';
import { BankSync } from './components/BankSync';
import type { Property, Transaction, Tenant, Unit, Reminder, Document, PaymentSettings, BankConnection, SyncedTransaction } from './types';
import { supabase } from './services/supabaseClient';
import type { User } from '@supabase/supabase-js';


const App: React.FC = () => {
  if (!supabase) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="p-8 text-center font-sans bg-red-50 text-red-800 border border-red-200 rounded-lg shadow-md max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>The application is missing the required Supabase credentials (URL and Key).</p>
          <p className="mt-2">These are typically set as environment variables and are necessary for the application to connect to its database.</p>
        </div>
      </div>
    );
  }

  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // State for Payment Gateway feature
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({ stripe_connected: false });
  const [tenantOnlinePay, setTenantOnlinePay] = useState<Record<string, boolean>>({});

  // State for Bank Sync feature
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [syncedTransactions, setSyncedTransactions] = useState<SyncedTransaction[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .order('address', { ascending: true });
        
        if (propertiesError) console.error('Error fetching properties:', propertiesError.message);
        else setProperties(propertiesData || []);

        const { data: unitsData, error: unitsError } = await supabase
            .from('units')
            .select('*')
            .order('unit_number', { ascending: true });

        if (unitsError) console.error('Error fetching units:', unitsError.message);
        else setUnits(unitsData || []);

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (transactionsError) console.error('Error fetching transactions:', transactionsError.message);
        else setTransactions(transactionsData || []);

        const { data: tenantsData, error: tenantsError } = await supabase
          .from('tenants')
          .select('*')
          .order('name', { ascending: true });

        if (tenantsError) console.error('Error fetching tenants:', tenantsError.message);
        else setTenants(tenantsData || []);
        
        const { data: remindersData, error: remindersError } = await supabase
            .from('reminders')
            .select('*');

        if (remindersError) console.error('Error fetching reminders:', remindersError.message);
        else setReminders(remindersData || []);
        
        const { data: documentsData, error: documentsError } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (documentsError) console.error('Error fetching documents:', documentsError.message);
        else setDocuments(documentsData || []);
      }
    };

    fetchData();
  }, [user]);

  const addProperty = async (property: Omit<Property, 'id' | 'notes'>) => {
    const { data, error } = await supabase
      .from('properties')
      .insert({ ...property, user_id: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding property:', error.message);
    } else if (data) {
      setProperties(prev => [...prev, data]);
    }
  };

  const deleteProperty = async (propertyId: string) => {
    // This should ideally be a transaction or a backend function
    // For now, cascade deletes manually
    // 1. Delete associated transactions
    const { error: transError } = await supabase.from('transactions').delete().eq('property_id', propertyId);
    if (transError) {
        console.error('Error deleting transactions for property:', transError.message);
        return;
    }
    // 2. Delete associated units
    const { error: unitsError } = await supabase.from('units').delete().eq('property_id', propertyId);
    if(unitsError) {
        console.error('Error deleting units for property:', unitsError.message);
        return;
    }
    // 3. Delete property itself
    const { error: propError } = await supabase.from('properties').delete().eq('id', propertyId);
    if (propError) {
        console.error('Error deleting property:', propError.message);
    } else {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setUnits(prev => prev.filter(u => u.property_id !== propertyId));
        setTransactions(prev => prev.filter(t => t.property_id !== propertyId));
        // Tenants will be unassigned, which is desired behavior
    }
  };

  const updateProperty = async (propertyId: string, updatedInfo: Partial<Omit<Property, 'id' | 'notes'>>) => {
    const { data, error } = await supabase
        .from('properties')
        .update(updatedInfo)
        .eq('id', propertyId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating property:', error.message);
    } else if (data) {
        setProperties(prev => prev.map(p => (p.id === propertyId ? data : p)));
    }
  };

  const updatePropertyNotes = async (propertyId: string, notes: string) => {
    const { data, error } = await supabase
        .from('properties')
        .update({ notes })
        .eq('id', propertyId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating notes:', error.message);
    } else if (data) {
        setProperties(prev => prev.map(p => (p.id === propertyId ? data : p)));
    }
  };

  const addUnit = async (unit: Omit<Unit, 'id'>) => {
    const { data, error } = await supabase
      .from('units')
      .insert({ ...unit, user_id: user?.id })
      .select()
      .single();

    if (error) {
        console.error('Error adding unit:', error.message);
    } else if (data) {
        setUnits(prev => [...prev, data].sort((a, b) => a.unit_number.localeCompare(b.unit_number)));
    }
  };

  const updateUnit = async (unitId: string, updatedInfo: Partial<Omit<Unit, 'id' | 'property_id'>>) => {
    const { data, error } = await supabase
      .from('units')
      .update(updatedInfo)
      .eq('id', unitId)
      .select()
      .single();
    
    if (error) {
        console.error('Error updating unit:', error.message);
    } else if (data) {
        setUnits(prev => prev.map(u => (u.id === unitId ? data : u)));
    }
  };

  const deleteUnit = async (unitId: string) => {
     // 1. Unassign tenants
     const { error: tenantError } = await supabase.from('tenants').update({ unit_id: null }).eq('unit_id', unitId);
     if (tenantError) {
         console.error('Error unassigning tenants:', tenantError.message);
         return;
     }
     // 2. Delete associated transactions
     const { error: transError } = await supabase.from('transactions').delete().eq('unit_id', unitId);
     if (transError) {
         console.error('Error deleting transactions for unit:', transError.message);
         return;
     }
     // 3. Delete unit
     const { error: unitError } = await supabase.from('units').delete().eq('id', unitId);
     if (unitError) {
         console.error('Error deleting unit:', unitError.message);
     } else {
         setUnits(prev => prev.filter(u => u.id !== unitId));
         setTenants(prev => prev.map(t => t.unit_id === unitId ? { ...t, unit_id: null } : t));
         setTransactions(prev => prev.filter(t => t.unit_id !== unitId));
     }
  };

  const addTenant = async (tenant: Omit<Tenant, 'id' | 'notes'>) => {
    const { data, error } = await supabase
      .from('tenants')
      .insert({ ...tenant, user_id: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding tenant:', error.message);
      throw error;
    } else if (data) {
      setTenants(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const updateTenant = async (tenantId: string, updatedInfo: Partial<Omit<Tenant, 'id' | 'notes'>>) => {
    const { data, error } = await supabase
      .from('tenants')
      .update(updatedInfo)
      .eq('id', tenantId)
      .select()
      .single();
    
    if (error) {
        console.error('Error updating tenant:', error.message);
    } else if (data) {
        setTenants(prev => prev.map(t => (t.id === tenantId ? data : t)).sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const updateTenantNotes = async (tenantId: string, notes: string) => {
    const { data, error } = await supabase
        .from('tenants')
        .update({ notes })
        .eq('id', tenantId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating tenant notes:', error.message);
    } else if (data) {
        setTenants(prev => prev.map(t => (t.id === tenantId ? data : t)));
    }
  };

  const updateTenantUnit = async (tenantId: string, unitId: string | null) => {
    const { data, error } = await supabase
        .from('tenants')
        .update({ unit_id: unitId })
        .eq('id', tenantId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating tenant property:', error.message);
    } else if (data) {
        setTenants(prev => prev.map(t => (t.id === tenantId ? data : t)));
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user?.id })
      .select()
      .single();

    if (error) {
        console.error('Error adding transaction:', error.message);
    } else if (data) {
        setTransactions(prev => [...prev, data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const updateTransaction = async (transactionId: string, updatedData: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedData)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
        console.error('Error updating transaction:', error.message);
    } else if (data) {
        setTransactions(prev => 
            prev.map(t => t.id === transactionId ? data : t)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    }
  };
  
  const deleteTransaction = async (transactionId: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) {
        console.error('Error deleting transaction:', error.message);
    } else {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }
  };

  const upsertReminder = async (reminderData: Partial<Reminder> & { tenant_id: string }) => {
    const { data, error } = await supabase
        .from('reminders')
        .upsert({ ...reminderData, user_id: user?.id }, { onConflict: 'tenant_id' })
        .select()
        .single();
    
    if (error) {
        console.error('Error upserting reminder:', error.message);
        throw error;
    } else if (data) {
        setReminders(prev => {
            const index = prev.findIndex(r => r.tenant_id === data.tenant_id);
            if (index !== -1) {
                const newReminders = [...prev];
                newReminders[index] = data;
                return newReminders;
            }
            return [...prev, data];
        });
    }
  };

  const uploadDocument = async (file: File, metadata: Omit<Document, 'id' | 'created_at' | 'file_path' | 'file_name' | 'file_size' | 'file_type'>) => {
    if (!user) throw new Error("User not authenticated");

    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
        throw uploadError;
    }

    const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
            ...metadata,
            user_id: user.id,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
        })
        .select()
        .single();
    
    if (insertError) {
        console.error('Error inserting document record:', insertError.message);
        await supabase.storage.from('documents').remove([filePath]);
        throw insertError;
    }

    if (data) {
        setDocuments(prev => [data, ...prev]);
    }
  };

  const deleteDocument = async (document: Document) => {
      const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);

      if (storageError) {
          console.error('Error deleting file from storage:', storageError.message);
      }

      const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', document.id);
      
      if (dbError) {
          console.error('Error deleting document record:', dbError.message);
          throw dbError;
      }

      setDocuments(prev => prev.filter(d => d.id !== document.id));
  };

  // FIX: Renamed the 'document' parameter to 'docToDownload' to avoid conflict with the global 'document' object.
  const downloadDocument = async (docToDownload: Document) => {
      const { data, error } = await supabase.storage.from('documents').download(docToDownload.file_path);
      if (error) {
          console.error("Error downloading file:", error.message);
          alert("Could not download file.");
          return;
      }
      if (data) {
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = docToDownload.file_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      }
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setActiveView('propertyDetail');
  };

  const handleBackToProperties = () => {
    setSelectedPropertyId(null);
    setActiveView('properties');
  };

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setActiveView('tenantDetail');
  };

  const handleBackToTenants = () => {
    setSelectedTenantId(null);
    setActiveView('tenants');
  };

  const handleNavigate = (view: string) => {
    if (view !== 'propertyDetail') {
      setSelectedPropertyId(null);
    }
    if (view !== 'tenantDetail') {
      setSelectedTenantId(null);
    }
    setActiveView(view);
  };

  const handleConnectStripe = () => setPaymentSettings({ stripe_connected: true });
  const handleDisconnectStripe = () => {
    setPaymentSettings({ stripe_connected: false });
    setTenantOnlinePay({}); // Also disable all tenants
  };

  const handleToggleTenantOnlinePay = (tenantId: string) => {
      setTenantOnlinePay(prev => ({
          ...prev,
          [tenantId]: !prev[tenantId],
      }));
  };

  const handleConnectBank = () => {
    const newConnection: BankConnection = {
        id: `conn_${Date.now()}`,
        bank_name: 'First National Bank (Demo)',
        account_name: 'Business Checking',
        last_four: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    setBankConnections(prev => [...prev, newConnection]);
  };

  const handleSyncTransactions = (connectionId: string) => {
      console.log(`Syncing transactions for ${connectionId}`);
      const mockTransactions: SyncedTransaction[] = [
          { id: `sync_${Date.now()}_1`, date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], description: 'HOME DEPOT #1234', amount: 125.43, is_debit: true },
          { id: `sync_${Date.now()}_2`, date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'ZELLE PAYMENT FROM JANE DOE', amount: 1800, is_debit: false },
          { id: `sync_${Date.now()}_3`, date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], description: 'PG&E UTILITIES', amount: 88.12, is_debit: true },
          { id: `sync_${Date.now()}_4`, date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], description: 'STARBUCKS', amount: 5.75, is_debit: true },
          { id: `sync_${Date.now()}_5`, date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], description: 'STRIPE TRANSFER', amount: 3550, is_debit: false },
      ];

      setSyncedTransactions(prev => {
          const existingDescriptions = new Set(prev.map(t => t.description));
          const newTxs = mockTransactions.filter(t => !existingDescriptions.has(t.description));
          return [...prev, ...newTxs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
  };

  const handleImportSyncedTransactions = (transactionsToImport: (Omit<Transaction, 'id'> & { sync_id: string })[]) => {
      const importPromises = transactionsToImport.map(txData => {
          const { sync_id, ...transaction } = txData;
          return addTransaction(transaction);
      });
      
      Promise.all(importPromises).then(() => {
        const importedIds = new Set(transactionsToImport.map(t => t.sync_id));
        setSyncedTransactions(prev => prev.filter(t => !importedIds.has(t.id)));
      });
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard properties={properties} transactions={transactions} />;
      case 'properties':
        return <Properties properties={properties} units={units} addProperty={addProperty} deleteProperty={deleteProperty} onSelectProperty={handleSelectProperty} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} updateTransaction={updateTransaction} properties={properties} units={units} />;
      case 'tenants':
        return <Tenants tenants={tenants} properties={properties} units={units} transactions={transactions} onSelectTenant={handleSelectTenant} addTenant={addTenant} />;
      case 'reminders':
        return <Reminders tenants={tenants} units={units} properties={properties} transactions={transactions} reminders={reminders} upsertReminder={upsertReminder} />;
      case 'onlinePayments':
        return <OnlinePayments 
            tenants={tenants}
            units={units}
            properties={properties}
            transactions={transactions}
            paymentSettings={paymentSettings}
            tenantOnlinePay={tenantOnlinePay}
            onNavigate={handleNavigate}
            addTransaction={addTransaction}
        />;
      case 'bankSync':
        return <BankSync
            properties={properties}
            units={units}
            bankConnections={bankConnections}
            syncedTransactions={syncedTransactions}
            onConnectBank={handleConnectBank}
            onSyncTransactions={handleSyncTransactions}
            onImportTransactions={handleImportSyncedTransactions}
        />;
      case 'documents':
        return <Documents 
          documents={documents}
          properties={properties}
          units={units}
          tenants={tenants}
          onUpload={uploadDocument}
          onDelete={deleteDocument}
          onDownload={downloadDocument}
        />;
       case 'settings':
        return <Settings 
            isStripeConnected={paymentSettings.stripe_connected}
            onConnectStripe={handleConnectStripe}
            onDisconnectStripe={handleDisconnectStripe}
        />;
      case 'propertyDetail': {
        const property = properties.find(p => p.id === selectedPropertyId);
        if (!property) {
          handleBackToProperties();
          return null;
        }
        const propertyUnits = units.filter(u => u.property_id === selectedPropertyId);
        const propertyTransactions = transactions.filter(t => t.property_id === selectedPropertyId);
        const propertyDocuments = documents.filter(d => d.property_id === selectedPropertyId);
        return <PropertyDetail 
          property={property} 
          units={propertyUnits} 
          transactions={propertyTransactions} 
          documents={propertyDocuments}
          onBack={handleBackToProperties} 
          onUpdateNotes={updatePropertyNotes} 
          onUpdateProperty={updateProperty} 
          addUnit={addUnit}
          updateUnit={updateUnit}
          deleteUnit={deleteUnit}
          onUploadDocument={uploadDocument}
          onDeleteDocument={deleteDocument}
          onDownloadDocument={downloadDocument}
        />;
      }
      case 'tenantDetail': {
        const tenant = tenants.find(t => t.id === selectedTenantId);
        if (!tenant) {
          handleBackToTenants();
          return null;
        }
        const unit = units.find(u => u.id === tenant.unit_id);
        const property = unit ? properties.find(p => p.id === unit.property_id) : undefined;
        const propertyTransactions = tenant.unit_id ? transactions.filter(t => t.unit_id === tenant.unit_id) : [];
        const tenantDocuments = documents.filter(d => d.tenant_id === tenant.id);

        return <TenantDetail 
            tenant={tenant} 
            unit={unit}
            property={property} 
            transactions={propertyTransactions}
            documents={tenantDocuments}
            properties={properties}
            units={units}
            onBack={handleBackToTenants} 
            onUpdateNotes={updateTenantNotes} 
            onUpdateTenant={updateTenant}
            onUpdateTenantUnit={updateTenantUnit}
            onSelectProperty={handleSelectProperty}
            addTransaction={addTransaction} 
            onUploadDocument={uploadDocument}
            onDeleteDocument={deleteDocument}
            onDownloadDocument={downloadDocument}
            isStripeConnected={paymentSettings.stripe_connected}
            onlinePayEnabled={!!tenantOnlinePay[tenant.id]}
            onToggleOnlinePay={handleToggleTenantOnlinePay}
        />;
      }
      default:
        return <Dashboard properties={properties} transactions={transactions} />;
    }
  };
  
  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="text-xl text-slate-600">Loading...</div>
        </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar 
        activeView={
          activeView === 'propertyDetail' ? 'properties' : 
          activeView === 'tenantDetail' ? 'tenants' : activeView
        } 
        setActiveView={handleNavigate} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <AIAssistant properties={properties} transactions={transactions} tenants={tenants} units={units} />
    </div>
  );
};

export default App;
