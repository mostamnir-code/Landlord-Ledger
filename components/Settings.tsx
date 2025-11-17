
import React from 'react';

interface SettingsProps {
    isStripeConnected: boolean;
    onConnectStripe: () => void;
    onDisconnectStripe: () => void;
}

const StripeLogo: React.FC = () => (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40.716 5.811c0-1.306-1.02-2.385-2.502-2.385-1.019 0-1.921.57-2.362 1.424h-.058V2.386h-3.36v14.94h3.36v-6.023c0-1.306 1.02-2.385 2.502-2.385 1.02 0 1.922.57 2.362 1.424h.058v6.984h3.36V8.196c0-1.306-.96-2.385-2.362-2.385zM27.288 12.3c.725 0 1.392-.454 1.625-1.137h3.418c-.363 2.673-2.618 4.54-5.043 4.54-3.072 0-5.497-2.212-5.497-5.497 0-3.285 2.425-5.497 5.497-5.497 2.425 0 4.68 1.867 5.043 4.54h-3.418c-.233-.683-.899-1.137-1.625-1.137-1.252 0-2.093.84-2.093 2.152 0 1.312.84 2.151 2.093 2.151zM14.072 4.604c-.305-.117-.61-.175-.974-.175-1.019 0-1.805.782-1.805 1.98v.35h3.61v-1.196c0-.454-.233-.84-.831-.959zM15.465 9.09h-5.27v1.867h4.053v2.846h-4.053v3.523h-3.36V2.386h4.622c2.094 0 3.668 1.137 3.668 3.014 0 1.312-.84 2.327-2.035 2.69zM4.11 17.326h3.36V7.094h2.152V4.248H.75v2.846h3.36v10.232z" fill="#635BFF"/>
    </svg>
);


export const Settings: React.FC<SettingsProps> = ({ isStripeConnected, onConnectStripe, onDisconnectStripe }) => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 max-w-2xl">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Payment Gateway</h2>
                <p className="text-slate-500 mb-6">Connect a payment provider to accept online rent payments from your tenants securely.</p>

                <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-md">
                            <StripeLogo />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Stripe</h3>
                            <p className="text-sm text-slate-500">Industry-standard for secure payments.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${isStripeConnected ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                            {isStripeConnected ? 'Connected' : 'Not Connected'}
                        </span>
                        {isStripeConnected ? (
                             <button onClick={onDisconnectStripe} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 font-semibold text-sm">
                                Disconnect
                            </button>
                        ) : (
                            <button onClick={onConnectStripe} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold text-sm">
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-xs text-slate-400">
                    <p>By connecting your Stripe account, you agree to their terms of service. Landlord Ledger does not charge any fees for this integration, but standard Stripe processing fees will apply to each transaction.</p>
                </div>
            </div>
        </div>
    );
};
