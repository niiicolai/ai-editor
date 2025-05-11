import { AvailableLlmType, AvailableLlmsType } from "../types/availableLlmType";

const API_URL = "http://localhost:3001/api/v1";

export default class AvailableLlmService {
    static async get(_id: string): Promise<AvailableLlmType> {
        const response = await fetch(`${API_URL}/available_llm/${_id}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as AvailableLlmType;
    }

    static async getAll(page: number, limit: number): Promise<AvailableLlmsType> {
        const response = await fetch(`${API_URL}/available_llms?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as AvailableLlmsType;
    }
}
