
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Properties } from './components/Properties';
import { TransactionsView } from './components/TransactionsView';
import { PropertyDetail } from './components/PropertyDetail';
import { Tenants } from './components/Tenants';
import { TenantDetail } from './components/TenantDetail';
import { AIAssistant } from './components/AIAssistant';
import { Auth } from './components/Auth';
import type { Property, Transaction, Tenant } from './types';
import { TransactionType } from './types';
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
    // Delete associated transactions first
    const { error: transError } = await supabase.from('transactions').delete().eq('property_id', propertyId);
    if (transError) {
        console.error('Error deleting transactions for property:', transError.message);
        return;
    }

    const { error: propError } = await supabase.from('properties').delete().eq('id', propertyId);
    if (propError) {
        console.error('Error deleting property:', propError.message);
    } else {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setTransactions(prev => prev.filter(t => t.property_id !== propertyId));
    }
  };

  const updateProperty = async (propertyId: string, updatedInfo: Partial<Omit<Property, 'id' | 'notes' | 'address'>>) => {
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

  const updateTenant = async (tenantId: string, updatedInfo: Partial<Omit<Tenant, 'id' | 'property_id' | 'notes'>>) => {
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
  
  const deleteTransaction = async (transactionId: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) {
        console.error('Error deleting transaction:', error.message);
    } else {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
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

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard properties={properties} transactions={transactions} />;
      case 'properties':
        return <Properties properties={properties} addProperty={addProperty} deleteProperty={deleteProperty} onSelectProperty={handleSelectProperty} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} properties={properties} />;
      case 'tenants':
        return <Tenants tenants={tenants} properties={properties} onSelectTenant={handleSelectTenant} addTenant={addTenant} />;
      case 'propertyDetail': {
        const property = properties.find(p => p.id === selectedPropertyId);
        if (!property) {
          handleBackToProperties();
          return null;
        }
        const propertyTransactions = transactions.filter(t => t.property_id === selectedPropertyId);
        return <PropertyDetail property={property} transactions={propertyTransactions} onBack={handleBackToProperties} onUpdateNotes={updatePropertyNotes} onUpdateProperty={updateProperty} />;
      }
      case 'tenantDetail': {
        const tenant = tenants.find(t => t.id === selectedTenantId);
        if (!tenant) {
          handleBackToTenants();
          return null;
        }
        const property = properties.find(p => p.id === tenant.property_id);
        const propertyTransactions = transactions.filter(t => t.property_id === tenant.property_id);
        return <TenantDetail 
            tenant={tenant} 
            property={property} 
            transactions={propertyTransactions}
            onBack={handleBackToTenants} 
            onUpdateNotes={updateTenantNotes} 
            onUpdateTenant={updateTenant}
            onSelectProperty={handleSelectProperty}
            addTransaction={addTransaction} 
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
      <AIAssistant properties={properties} transactions={transactions} tenants={tenants} />
    </div>
  );
};

export default App;
