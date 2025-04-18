import { ProductType, ProductsType } from "../types/productType";

const API_URL = "http://localhost:3002/api/v1";

export default class ProductService {
    static async get(_id: string): Promise<ProductType> {
        const response = await fetch(`${API_URL}/product/${_id}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProductType;
    }

    static async getAll(page: number, limit: number, category: string): Promise<ProductsType> {
        const response = await fetch(`${API_URL}/products?page=${page}&limit=${limit}&category=${category}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProductsType;
    }
}
