import React, { useState } from 'react';
import type { Property, Unit } from '../types';
import type { User } from '@supabase/supabase-js';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  addProperty: (property: Omit<Property, 'id' | 'notes'>) => Promise<Property | null>;
  addUnit: (unit: Omit<Unit, 'id'>) => Promise<void>;
  user: User | null;
}

const Steps = ['Welcome', 'Add Property', 'Add Unit', 'Finish'];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onComplete, addProperty, addUnit, user }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Property State
  const [propertyAddress, setPropertyAddress] = useState('');
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);

  // Step 2: Unit State
  const [unitNumber, setUnitNumber] = useState('');
  const [rent, setRent] = useState('');
  const [leaseEnd, setLeaseEnd] = useState('');

  if (!isOpen) return null;

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyAddress) return;
    setLoading(true);
    try {
        const newProperty = await addProperty({ address: propertyAddress });
        if (newProperty) {
            setCreatedPropertyId(newProperty.id);
            setCurrentStep(2);
        }
    } catch (error) {
        console.error("Error in onboarding property creation", error);
        alert("Failed to create property. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !rent || !leaseEnd || !createdPropertyId) return;
    setLoading(true);
    try {
        await addUnit({
            property_id: createdPropertyId,
            unit_number: unitNumber,
            rent: parseFloat(rent),
            lease_end: leaseEnd,
        });
        setCurrentStep(3);
    } catch (error) {
        console.error("Error in onboarding unit creation", error);
        alert("Failed to create unit. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Header / Progress */}
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex space-x-2">
                {Steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-2 w-8 rounded-full transition-colors duration-300 ${idx <= currentStep ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                ))}
            </div>
            <button onClick={onComplete} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium">
                Skip
            </button>
        </div>

        {/* Content */}
        <div className="p-8">
            
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mx-auto w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6.75h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M12.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to Landlord Ledger!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Hi {user?.user_metadata?.full_name || 'there'}! We're excited to help you manage your properties. Let's get your portfolio set up in just a few minutes.
                        </p>
                    </div>
                    <button 
                        onClick={() => setCurrentStep(1)}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-md transition-transform active:scale-95"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {/* Step 1: Add Property */}
            {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Your First Property</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Start by entering the address of a property you manage.</p>
                    </div>
                    <form onSubmit={handleAddProperty} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Address</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 123 Main St, New York, NY"
                                value={propertyAddress}
                                onChange={(e) => setPropertyAddress(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                autoFocus
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!propertyAddress || loading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-all"
                        >
                            {loading ? 'Saving...' : 'Next: Add Units'}
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: Add Unit */}
            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add a Unit</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Now, let's add a unit to <strong>{propertyAddress}</strong>.</p>
                    </div>
                    <form onSubmit={handleAddUnit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unit Number / Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Apt 1, Suite B"
                                value={unitNumber}
                                onChange={(e) => setUnitNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                autoFocus
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Rent</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-slate-500">$</span>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        value={rent}
                                        onChange={(e) => setRent(e.target.value)}
                                        className="w-full pl-7 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lease End Date</label>
                                <input 
                                    type="date" 
                                    value={leaseEnd}
                                    onChange={(e) => setLeaseEnd(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                        <button 
                            type="submit"
                            disabled={!unitNumber || !rent || !leaseEnd || loading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-all"
                        >
                             {loading ? 'Saving...' : 'Finish Setup'}
                        </button>
                    </form>
                </div>
            )}

            {/* Step 3: Finish */}
            {currentStep === 3 && (
                 <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You're All Set!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Your property and unit have been added. You can now start tracking income, expenses, and tenants.
                        </p>
                    </div>
                    <button 
                        onClick={onComplete}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-md transition-transform active:scale-95"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};