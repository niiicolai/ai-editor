export interface TransactionType {
    _id: string;
    type: string;
    state: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionsType {
    transactions: TransactionType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
