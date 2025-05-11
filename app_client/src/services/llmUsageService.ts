import { LlmUsageType, LlmUsagesType } from "../types/llmUsageType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3001/api/v1";

export default class LlmUsageService {
    static async get(_id: string): Promise<LlmUsageType> {
        const response = await fetch(`${API_URL}/llm_usage/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as LlmUsageType;
    }

    static async getAll(page: number, limit: number): Promise<LlmUsagesType> {
        const response = await fetch(`${API_URL}/llm_usages?page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as LlmUsagesType;
    }
}
