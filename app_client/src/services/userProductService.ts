import { UserProductType, UserProductsType } from "../types/userProductType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3002/api/v1";

export default class UserProductService {
    static async get(_id: string): Promise<UserProductType> {
        const response = await fetch(`${API_URL}/user_product/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserProductType;
    }

    static async getAll(page: number, limit: number): Promise<UserProductsType> {
        const response = await fetch(`${API_URL}/user_products?page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserProductsType;
    }
}
