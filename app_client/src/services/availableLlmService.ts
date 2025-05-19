import { AvailableLlmType, AvailableLlmsType } from "../types/availableLlmType";

const API_URL = import.meta.env.VITE_AGENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(availableLlmService.ts): VITE_AGENT_API should be set in the .env file');

export default class AvailableLlmService {
    static async get(_id: string): Promise<AvailableLlmType> {
        const response = await fetch(`${API_URL}/api/v1/available_llm/${_id}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as AvailableLlmType;
    }

    static async getAll(page: number, limit: number): Promise<AvailableLlmsType> {
        const response = await fetch(`${API_URL}/api/v1/available_llms?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as AvailableLlmsType;
    }
}
