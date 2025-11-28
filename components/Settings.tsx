
import React, { useState, useEffect } from 'react';

interface SettingsProps {
    user: any;
    onLogout: () => void;
    onUpdateProfile: (name: string) => Promise<void>;
    isStripeConnected: boolean;
    onConnectStripe: () => void;
    onDisconnectStripe: () => void;
}

const StripeLogo: React.FC = () => (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40.716 5.811c0-1.306-1.02-2.385-2.502-2.385-1.019 0-1.921.57-2.362 1.424h-.058V2.386h-3.36v14.94h3.36v-6.023c0-1.306 1.02-2.385 2.502-2.385 1.02 0 1.922.57 2.362 1.424h.058v6.984h3.36V8.196c0-1.306-.96-2.385-2.362-2.385zM27.288 12.3c.725 0 1.392-.454 1.625-1.137h3.418c-.363 2.673-2.618 4.54-5.043 4.54-3.072 0-5.497-2.212-5.497-5.497 0-3.285 2.425-5.497 5.497-5.497 2.425 0 4.68 1.867 5.043 4.54h-3.418c-.233-.683-.899-1.137-1.625-1.137-1.252 0-2.093.84-2.093 2.152 0 1.312.84 2.151 2.093 2.151zM14.072 4.604c-.305-.117-.61-.175-.974-.175-1.019 0-1.805.782-1.805 1.98v.35h3.61v-1.196c0-.454-.233-.84-.831-.959zM15.465 9.09h-5.27v1.867h4.053v2.846h-4.053v3.523h-3.36V2.386h4.622c2.094 0 3.668 1.137 3.668 3.014 0 1.312-.84 2.327-2.035 2.69zM4.11 17.326h3.36V7.094h2.152V4.248H.75v2.846h3.36v10.232z" fill="#635BFF"/>
    </svg>
);

const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ArrowRightOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);


export const Settings: React.FC<SettingsProps> = ({ user, onLogout, onUpdateProfile, isStripeConnected, onConnectStripe, onDisconnectStripe }) => {
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
        }
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onUpdateProfile(fullName);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
            
            {/* User Profile Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-2xl">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    User Profile
                </h2>
                
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={user?.email || ''} 
                            disabled 
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Email cannot be changed.</p>
                    </div>
                    
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit" 
                            disabled={isSaving || fullName === user?.user_metadata?.full_name}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Payment Gateway Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-2xl">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Payment Gateway</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Connect a payment provider to accept online rent payments from your tenants securely.</p>

                <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md">
                            <StripeLogo />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Stripe</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Industry-standard for secure payments.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${isStripeConnected ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                            {isStripeConnected ? 'Connected' : 'Not Connected'}
                        </span>
                        {isStripeConnected ? (
                             <button onClick={onDisconnectStripe} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-sm">
                                Disconnect
                            </button>
                        ) : (
                            <button onClick={onConnectStripe} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold text-sm">
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                    <p>By connecting your Stripe account, you agree to their terms of service. Landlord Ledger does not charge any fees for this integration, but standard Stripe processing fees will apply to each transaction.</p>
                </div>
            </div>

            {/* Account Actions Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 max-w-2xl">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Account Actions</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">Sign Out</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Securely log out of your account on this device.</p>
                    </div>
                    <button 
                        onClick={onLogout} 
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};
