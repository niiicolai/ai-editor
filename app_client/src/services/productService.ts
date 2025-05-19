import { ProductType, ProductsType } from "../types/productType";

const API_URL = import.meta.env.VITE_PAYMENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(productService.ts): VITE_PAYMENT_API should be set in the .env file');

export default class ProductService {
    static async get(_id: string): Promise<ProductType> {
        const response = await fetch(`${API_URL}/api/v1/product/${_id}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProductType;
    }

    static async getAll(page: number, limit: number, category: string): Promise<ProductsType> {
        const response = await fetch(`${API_URL}/api/v1/products?page=${page}&limit=${limit}&category=${category}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProductsType;
    }
}
