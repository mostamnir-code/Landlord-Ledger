import type { SyncedTransaction } from '../types';

// In a real app, these would be calls to your backend server.
// We are simulating the backend calls here for demonstration purposes.

// 1. Create a link_token
export const createLinkToken = async (): Promise<{ link_token: string }> => {
    // This is a mock token. In a real app, your server would request this from Plaid.
    console.log("Simulating backend: Requesting link_token from Plaid...");
    return Promise.resolve({ link_token: 'fake-link-token' });
};

// 2. Exchange public_token for an access_token
export const exchangePublicToken = async (public_token: string): Promise<{ access_token: string }> => {
    // This is a mock token exchange. In a real app, your server would do this.
    console.log(`Simulating backend: Exchanging public_token "${public_token}" for an access_token...`);
    return Promise.resolve({ access_token: `fake-access-token-for-${public_token}` });
};

// 3. Fetch transactions using the access_token
export const fetchTransactions = async (access_token: string): Promise<SyncedTransaction[]> => {
    console.log(`Simulating backend: Fetching transactions with access_token "${access_token}"...`);
    
    // Return mock transaction data
    const mockTransactions: SyncedTransaction[] = [
        { id: `sync_plaid_${Date.now()}_1`, date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], description: 'HOME DEPOT #1234', amount: 125.43, is_debit: true },
        { id: `sync_plaid_${Date.now()}_2`, date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'ZELLE PAYMENT FROM JANE DOE', amount: 1800, is_debit: false },
        { id: `sync_plaid_${Date.now()}_3`, date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], description: 'PG&E UTILITIES', amount: 88.12, is_debit: true },
        { id: `sync_plaid_${Date.now()}_4`, date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], description: 'STARBUCKS', amount: 5.75, is_debit: true },
        { id: `sync_plaid_${Date.now()}_5`, date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], description: 'STRIPE TRANSFER', amount: 3550, is_debit: false },
    ];
    
    return Promise.resolve(mockTransactions);
};
