
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Dashboard } from './components/Dashboard';
import { Properties } from './components/Properties';
import { TransactionsView } from './components/TransactionsView';
import { Tenants } from './components/Tenants';
import { PropertyDetail } from './components/PropertyDetail';
import { AIAssistant } from './components/AIAssistant';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Auth } from './components/Auth';
import { Settings } from './components/Settings';
import { OnlinePayments } from './components/OnlinePayments';
import { BankSync } from './components/BankSync';
import { Reports } from './components/Reports';
import { Reminders } from './components/Reminders';
import { Documents } from './components/Documents';
import { OnboardingWizard } from './components/OnboardingWizard';
import { supabase } from './services/supabaseClient';
import type { Property, Unit, Transaction, Tenant, Document, Reminder, BankConnection, SyncedTransaction, RecurringTransaction, PaymentSettings } from './types';
import { useData } from './hooks/useData';

export const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // UI State
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Data State from our custom hook
  const {
    loading: loadingData,
    error,
    properties, addProperty, setProperties, 
    units, addUnit, setUnits,
    tenants, addTenant, setTenants,
    transactions, addTransaction, setTransactions,
    documents, setDocuments,
    reminders, setReminders,
    recurringTransactions, setRecurringTransactions,
    bankConnections, setBankConnections,
    syncedTransactions, setSyncedTransactions,
    paymentSettings, setPaymentSettings,
  } = useData(user);

  useEffect(() => {
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoadingAuth(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    } else {
        setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
      if (darkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [darkMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // --- Handlers ---
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleBackToProperties = () => {
      setSelectedPropertyId(null);
      setActiveView('properties');
  };

  const onSelectProperty = (id: string) => {
      setSelectedPropertyId(id);
      setActiveView('propertyDetail');
  };

  // --- User Management ---
  const handleLogout = async () => {
      if (supabase) {
          await supabase.auth.signOut();
          setUser(null);
          // Reset all data
          setProperties([]);
          setUnits([]);
          setTenants([]);
          setTransactions([]);
          setDocuments([]);
          setReminders([]);
          setRecurringTransactions([]);
          setBankConnections([]);
          setSyncedTransactions([]);
          setPaymentSettings({ stripe_connected: false });
          setSelectedPropertyId(null);
          setActiveView('dashboard');
          toast.success('Logged out successfully');
      }
  };

  const handleUpdateUser = async (fullName: string) => {
      if (!supabase) return;
      const { data, error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
      if (error) {
          toast.error("Error updating profile: " + error.message);
      } else if (data.user) {
          setUser(data.user);
          toast.success("Profile updated successfully.");
      }
  };

  // --- Mock CRUD Operations ---
  const addPropertiesBulk = async (propertiesData: Omit<Property, 'id'>[]) => {
    console.log("Bulk adding properties (mocked):", propertiesData);
    toast.success('Bulk properties added (mock)');
  };
  const updateProperty = (id: string, data: Partial<Omit<Property, 'id'>>) => {
      setProperties(properties.map(p => p.id === id ? { ...p, ...data } as Property : p));
      toast.success('Property updated (mock)');
  };
  const updatePropertyNotes = (id: string, notes: string) => {
      setProperties(properties.map(p => p.id === id ? { ...p, notes } : p));
      toast.success('Property notes updated (mock)');
  };
  const deleteProperty = (id: string) => {
      setProperties(properties.filter(p => p.id !== id));
      toast.success('Property deleted (mock)');
  };
  const updateUnit = (id: string, data: Partial<Omit<Unit, 'id'>>) => {
      setUnits(units.map(u => u.id === id ? { ...u, ...data } as Unit : u));
      toast.success('Unit updated (mock)');
  };
  const deleteUnit = (id: string) => {
      setUnits(units.filter(u => u.id !== id));
      toast.success('Unit deleted (mock)');
  };
  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...data } as Transaction: t));
    toast.success('Transaction updated (mock)');
  };
  const deleteTransaction = (id: string) => {
      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transaction deleted (mock)');
  };
  const updateTenant = (id: string, data: Partial<Omit<Tenant, 'id'>>) => {
      setTenants(tenants.map(t => t.id === id ? { ...t, ...data } as Tenant : t));
      toast.success('Tenant updated (mock)');
  };
  const onSelectTenant = (id: string) => {};
  const uploadDocument = async (file: File, metadata: any) => { toast.success('Document uploaded (mock)'); };
  const deleteDocument = async (doc: Document) => { toast.success('Document deleted (mock)'); };
  const downloadDocument = async (doc: Document) => { toast.success('Document downloaded (mock)'); };
  const upsertReminder = async (data: any) => { toast.success('Reminder saved (mock)'); };
  const addRecurringTransaction = async (data: any) => { toast.success('Recurring transaction added (mock)'); };
  const updateRecurringTransaction = async (id: string, data: any) => { toast.success('Recurring transaction updated (mock)'); };
  const deleteRecurringTransaction = async (id: string) => { toast.success('Recurring transaction deleted (mock)'); };
  const onAddConnection = (conn: BankConnection) => { toast.success('Bank connection added (mock)'); };
  const onSyncTransactions = async (conn: BankConnection) => { toast.success('Transactions synced (mock)'); };
  const onImportTransactions = (txs: any[]) => { toast.success('Transactions imported (mock)'); };

  if (loadingAuth || loadingData) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Auth />;

  const renderContent = () => {
      switch (activeView) {
        case 'dashboard':
            return <Dashboard properties={properties} transactions={transactions} darkMode={darkMode} />;
        case 'properties':
            return <Properties 
                properties={properties} 
                units={units} 
                addProperty={addProperty} 
                addPropertiesBulk={addPropertiesBulk} 
                deleteProperty={deleteProperty} 
                onSelectProperty={onSelectProperty} 
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
                tenants={tenants}
                transactions={propertyTransactions} 
                documents={propertyDocuments}
                onBack={handleBackToProperties} 
                onUpdateNotes={updatePropertyNotes} 
                onUpdateProperty={updateProperty} 
                addUnit={addUnit}
                updateUnit={updateUnit}
                deleteUnit={deleteUnit}
                onUpdateTenant={updateTenant}
                onUploadDocument={uploadDocument}
                onDeleteDocument={deleteDocument}
                onDownloadDocument={downloadDocument}
                darkMode={darkMode}
              />;
            }
        case 'transactions':
            return <TransactionsView 
                transactions={transactions} 
                addTransaction={addTransaction} 
                deleteTransaction={deleteTransaction} 
                updateTransaction={updateTransaction}
                properties={properties}
                units={units}
                recurringTransactions={recurringTransactions}
                addRecurringTransaction={addRecurringTransaction}
                updateRecurringTransaction={updateRecurringTransaction}
                deleteRecurringTransaction={deleteRecurringTransaction}
            />;
        case 'tenants':
            return <Tenants 
                tenants={tenants} 
                properties={properties} 
                units={units} 
                transactions={transactions}
                onSelectTenant={onSelectTenant} 
                addTenant={addTenant} 
            />;
        case 'onlinePayments':
            return <OnlinePayments tenants={tenants} units={units} properties={properties} transactions={transactions} paymentSettings={paymentSettings} tenantOnlinePay={{}} onNavigate={setActiveView} addTransaction={addTransaction}/>;
        case 'bankSync':
            return <BankSync properties={properties} units={units} bankConnections={bankConnections} syncedTransactions={syncedTransactions} onAddConnection={onAddConnection} onSyncTransactions={onSyncTransactions} onImportTransactions={onImportTransactions} tenants={tenants}/>;
        case 'reports':
            return <Reports properties={properties} transactions={transactions} units={units} />;
        case 'reminders':
            return <Reminders tenants={tenants} units={units} properties={properties} transactions={transactions} reminders={reminders} upsertReminder={upsertReminder} />;
        case 'documents':
            return <Documents documents={documents} properties={properties} units={units} tenants={tenants} onUpload={uploadDocument} onDelete={deleteDocument} onDownload={downloadDocument} />;
        case 'settings':
            return <Settings user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateUser} isStripeConnected={paymentSettings.stripe_connected} onConnectStripe={() => setPaymentSettings({ ...paymentSettings, stripe_connected: true })} onDisconnectStripe={() => setPaymentSettings({ ...paymentSettings, stripe_connected: false })} />;
        default:
            return <Dashboard properties={properties} transactions={transactions} darkMode={darkMode} />;
    }
  };

  return (
      <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200`}>
          <Toaster position="bottom-right" />
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                  {/* The error from the hook is now handled by a toast, so this can be removed */}
                  {/* {error && <div className="bg-red-500 text-white p-4 mb-4 rounded-md">{error}</div>} */}
                  {renderContent()}
              </main>
          </div>
          <AIAssistant properties={properties} transactions={transactions} tenants={tenants} units={units} />
          <OnboardingWizard 
              isOpen={showOnboarding} 
              onComplete={() => setShowOnboarding(false)} 
              addProperty={addProperty}
              addUnit={addUnit}
              user={user}
          />
      </div>
  );
};
