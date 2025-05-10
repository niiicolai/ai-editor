import { TransactionType, TransactionsType } from "../types/transactionType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3002/api/v1";

export default class PaymentJobService {
    static async get(_id: string): Promise<TransactionType> {
        const response = await fetch(`${API_URL}/transaction/${_id}`, {
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
        const response = await fetch(`${API_URL}/transactions?page=${page}&limit=${limit}&state=${state}`, {
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
