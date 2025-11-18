import type { SyncedTransaction } from '../types';

// In a real app, these would be calls to your backend server.
// We are simulating the backend calls here for demonstration purposes.

// 1. Create a connect_token to initialize Salt Edge Connect
export const createConnectToken = async (): Promise<{ connect_token: string }> => {
    // This is a mock token. In a real app, your server would request this from Salt Edge.
    console.log("Simulating backend: Requesting connect_token from Salt Edge...");
    return Promise.resolve({ connect_token: 'fake-salt-edge-connect-token' });
};

// 2. Fetch transactions using the connection_id
export const fetchTransactions = async (connection_id: string): Promise<SyncedTransaction[]> => {
    console.log(`Simulating backend: Fetching transactions with connection_id "${connection_id}"...`);
    
    // Return mock international transaction data
    const mockTransactions: SyncedTransaction[] = [
        { id: `sync_se_${Date.now()}_1`, date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], description: 'REVOLUT TRANSFER FROM JOHN A.', amount: 1200, is_debit: false },
        { id: `sync_se_${Date.now()}_2`, date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], description: 'TESCO', amount: 45.50, is_debit: true },
        { id: `sync_se_${Date.now()}_3`, date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], description: 'EON ENERGY DIRECT DEBIT', amount: 78.20, is_debit: true },
        { id: `sync_se_${Date.now()}_4`, date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], description: 'AMAZON.CO.UK', amount: 15.99, is_debit: true },
    ];
    
    return Promise.resolve(mockTransactions);
};
