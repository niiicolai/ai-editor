import { CheckoutType, CheckoutsType } from "../types/checkoutType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3002/api/v1";

export default class CheckoutService {
    static async get(_id: string): Promise<CheckoutType> {
        const response = await fetch(`${API_URL}/checkout/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CheckoutType;
    }

    static async getAll(page: number, limit: number, state: string): Promise<CheckoutsType> {
        const response = await fetch(`${API_URL}/checkouts?page=${page}&limit=${limit}&state=${state}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CheckoutsType;
    }

    static async getOrCreate(): Promise<CheckoutType> {
        const response = await fetch(`${API_URL}/find_or_create_checkout`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CheckoutType;
    }

    static async create(products: [{
        product: string,
        quantity: number,
    }]): Promise<CheckoutType> {
        const response = await fetch(`${API_URL}/checkout`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'authorization': `Bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({
                products
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CheckoutType;
    }

    static async update(_id: string, products: [{
        product: string,
        quantity: number,
    }]): Promise<CheckoutType> {
        const response = await fetch(`${API_URL}/checkout/${_id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'authorization': `Bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({
                products
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as CheckoutType;
    }

    static async startCheckout(_id: string): Promise<string> {
        const response = await fetch(`${API_URL}/start_checkout/${_id}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'authorization': `Bearer ${TokenService.getToken()}`
            },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as string;
    }
}
