import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Properties } from './components/Properties';
import { TransactionsView } from './components/TransactionsView';
import { PropertyDetail } from './components/PropertyDetail';
import { AIAssistant } from './components/AIAssistant';
import { Auth } from './components/Auth';
import type { Property, Transaction } from './types';
import { TransactionType } from './types';
import { supabase } from './services/supabaseClient';
import type { User } from '@supabase/supabase-js';


const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
    const { error: transError } = await supabase.from('transactions').delete().eq('propertyId', propertyId);
    if (transError) {
        console.error('Error deleting transactions for property:', transError.message);
        return;
    }

    const { error: propError } = await supabase.from('properties').delete().eq('id', propertyId);
    if (propError) {
        console.error('Error deleting property:', propError.message);
    } else {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setTransactions(prev => prev.filter(t => t.propertyId !== propertyId));
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

  const handleNavigate = (view: string) => {
    if (view !== 'propertyDetail') {
      setSelectedPropertyId(null);
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
      case 'propertyDetail': {
        const property = properties.find(p => p.id === selectedPropertyId);
        if (!property) {
          handleBackToProperties();
          return null;
        }
        const propertyTransactions = transactions.filter(t => t.propertyId === selectedPropertyId);
        return <PropertyDetail property={property} transactions={propertyTransactions} onBack={handleBackToProperties} onUpdateNotes={updatePropertyNotes} />;
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
      <Sidebar activeView={activeView === 'propertyDetail' ? 'properties' : activeView} setActiveView={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <AIAssistant properties={properties} transactions={transactions} />
    </div>
  );
};

export default App;