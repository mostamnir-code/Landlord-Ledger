
import React, { useState, useEffect } from 'react';
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
import { TransactionType } from './types';

export const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Data State
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
  const [tenantOnlinePay, setTenantOnlinePay] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    } else {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
      if (darkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [darkMode]);

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
          
          // Clear User
          setUser(null);
          
          // Clear all Data State to prevent bleeding
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
          setTenantOnlinePay({});
          
          // Reset UI State
          setSelectedPropertyId(null);
          setActiveView('dashboard');
      }
  };

  const handleUpdateUser = async (fullName: string) => {
      if (!supabase) return;
      const { data, error } = await supabase.auth.updateUser({
          data: { full_name: fullName }
      });
      if (error) {
          alert("Error updating profile: " + error.message);
      } else if (data.user) {
          setUser(data.user);
          alert("Profile updated successfully.");
      }
  };

  // --- CRUD Operations (Mocked for local state simplicity in this fix) ---

  const addProperty = async (propertyData: Omit<Property, 'id' | 'notes'>): Promise<Property | null> => {
      const newProperty: Property = { ...propertyData, id: Date.now().toString(), notes: '' };
      setProperties([...properties, newProperty]);
      
      // If it's a single family home, automatically create the main unit
      if (propertyData.type === 'SINGLE_FAMILY') {
          await addUnit({
              property_id: newProperty.id,
              unit_number: 'Main House',
              rent: 0, // Default, user should edit
          });
      }
      return newProperty;
  };

  const addPropertiesBulk = async (propertiesData: Omit<Property, 'id' | 'notes'>[]) => {
      const newProperties = propertiesData.map(p => ({ ...p, id: Date.now().toString() + Math.random(), notes: '' }));
      setProperties([...properties, ...newProperties]);
  };

  const updateProperty = (id: string, data: Partial<Omit<Property, 'id' | 'notes'>>) => {
      setProperties(properties.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const updatePropertyNotes = (id: string, notes: string) => {
      setProperties(properties.map(p => p.id === id ? { ...p, notes } : p));
  };

  const deleteProperty = (id: string) => {
      setProperties(properties.filter(p => p.id !== id));
      setUnits(units.filter(u => u.property_id !== id));
      setTransactions(transactions.filter(t => t.property_id !== id));
      // Also cleanup tenants assigned to deleted units
      const deletedUnitIds = units.filter(u => u.property_id === id).map(u => u.id);
      setTenants(tenants.map(t => deletedUnitIds.includes(t.unit_id || '') ? { ...t, unit_id: null } : t));
  };

  const addUnit = async (unitData: Omit<Unit, 'id'>) => {
      const newUnit: Unit = { ...unitData, id: Date.now().toString() };
      setUnits([...units, newUnit]);
  };

  const updateUnit = (id: string, data: Partial<Omit<Unit, 'id' | 'property_id'>>) => {
      setUnits(units.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUnit = (id: string) => {
      setUnits(units.filter(u => u.id !== id));
      setTenants(tenants.map(t => t.unit_id === id ? { ...t, unit_id: null } : t));
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = { ...txData, id: Date.now().toString() };
      setTransactions([...transactions, newTx]);
  };

  const updateTransaction = (id: string, data: Omit<Transaction, 'id'>) => {
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTransaction = (id: string) => {
      setTransactions(transactions.filter(t => t.id !== id));
  };

  const addTenant = async (tenantData: Omit<Tenant, 'id' | 'notes'>) => {
      const newTenant: Tenant = { ...tenantData, id: Date.now().toString() };
      setTenants([...tenants, newTenant]);
  };

  const updateTenant = (id: string, data: Partial<Omit<Tenant, 'id' | 'notes'>>) => {
      setTenants(tenants.map(t => t.id === id ? { ...t, ...data } : t));
  };
  
  const onSelectTenant = (id: string) => {
    // Placeholder for tenant detail navigation
  };

  const uploadDocument = async (file: File, metadata: any) => {
      const newDoc: Document = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          file_name: file.name,
          file_path: URL.createObjectURL(file), // Mock path
          file_size: file.size,
          file_type: file.type,
          ...metadata
      };
      setDocuments([...documents, newDoc]);
  };

  const deleteDocument = async (doc: Document) => {
      setDocuments(documents.filter(d => d.id !== doc.id));
  };

  const downloadDocument = async (doc: Document) => {
      // Mock download
      const link = document.createElement('a');
      link.href = doc.file_path;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const upsertReminder = async (data: Partial<Reminder> & { tenant_id: string }) => {
      const existing = reminders.find(r => r.tenant_id === data.tenant_id);
      if (existing) {
          setReminders(reminders.map(r => r.id === existing.id ? { ...r, ...data } : r));
      } else {
          setReminders([...reminders, { 
              id: Date.now().toString(), 
              enabled: false, 
              due_date_reminder_days: 3, 
              late_fee_reminder_days: 2, 
              late_fee_amount: 50, 
              ...data 
            } as Reminder]);
      }
  };
  
  const addRecurringTransaction = async (data: Omit<RecurringTransaction, 'id'>) => {
      setRecurringTransactions([...recurringTransactions, { ...data, id: Date.now().toString() }]);
  }
  
  const updateRecurringTransaction = async (id: string, data: Partial<Omit<RecurringTransaction, 'id'>>) => {
      setRecurringTransactions(recurringTransactions.map(rt => rt.id === id ? { ...rt, ...data } : rt));
  }

  const deleteRecurringTransaction = async (id: string) => {
      setRecurringTransactions(recurringTransactions.filter(rt => rt.id !== id));
  }
  
  // Bank Sync Handlers
  const onAddConnection = (conn: BankConnection) => setBankConnections([...bankConnections, conn]);
  const onSyncTransactions = async (conn: BankConnection) => {
      // Mock sync - typically calls service
      import('./services/plaidClient').then(async (mod) => {
          const txs = await mod.fetchTransactions('mock-access-token');
          setSyncedTransactions([...syncedTransactions, ...txs]);
      });
  };
  const onImportTransactions = (txs: any[]) => {
      const newTxs = txs.map(t => {
          const { sync_id, ...rest } = t;
          return { ...rest, id: Date.now().toString() + Math.random() } as Transaction;
      });
      setTransactions([...transactions, ...newTxs]);
      // Remove from synced list or mark as imported
      setSyncedTransactions(syncedTransactions.filter(st => !txs.find(t => t.sync_id === st.id)));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
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
              return <OnlinePayments 
                  tenants={tenants} 
                  units={units} 
                  properties={properties} 
                  transactions={transactions} 
                  paymentSettings={paymentSettings} 
                  tenantOnlinePay={tenantOnlinePay}
                  onNavigate={setActiveView}
                  addTransaction={addTransaction}
              />;
          case 'bankSync':
              return <BankSync 
                  properties={properties} 
                  units={units} 
                  bankConnections={bankConnections} 
                  syncedTransactions={syncedTransactions} 
                  onAddConnection={onAddConnection} 
                  onSyncTransactions={onSyncTransactions} 
                  onImportTransactions={onImportTransactions} 
                  tenants={tenants}
              />;
          case 'reports':
              return <Reports properties={properties} transactions={transactions} units={units} />;
          case 'reminders':
              return <Reminders tenants={tenants} units={units} properties={properties} transactions={transactions} reminders={reminders} upsertReminder={upsertReminder} />;
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
                  user={user}
                  onLogout={handleLogout}
                  onUpdateProfile={handleUpdateUser}
                  isStripeConnected={paymentSettings.stripe_connected} 
                  onConnectStripe={() => setPaymentSettings({ ...paymentSettings, stripe_connected: true })} 
                  onDisconnectStripe={() => setPaymentSettings({ ...paymentSettings, stripe_connected: false })} 
              />;
          default:
              return <Dashboard properties={properties} transactions={transactions} darkMode={darkMode} />;
      }
  };

  return (
      <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200`}>
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col overflow-hidden">
              <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
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
