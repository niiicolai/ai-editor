import { TransactionType, TransactionsType } from "../types/transactionType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_AUTH_API;
if (!API_URL) console.error('CONFIGURATION ERROR(authTransactionService.ts): VITE_AUTH_API should be set in the .env file');

export default class AuthJobService {
    static async get(_id: string): Promise<TransactionType> {
        const response = await fetch(`${API_URL}/api/v1/transaction/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as TransactionType;
    }

    static async getAll(page: number, limit: number, state: string): Promise<TransactionsType> {
        const response = await fetch(`${API_URL}/api/v1/transactions?page=${page}&limit=${limit}&state=${state}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as TransactionsType;
    }
}
