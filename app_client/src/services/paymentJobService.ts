import { JobType, JobsType } from "../types/jobType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_PAYMENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(paymentJobService.ts): VITE_PAYMENT_API should be set in the .env file');

export default class PaymentJobService {
    static async get(_id: string): Promise<JobType> {
        const response = await fetch(`${API_URL}/api/v1/job/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as JobType;
    }

    static async getAll(page: number, limit: number, state: string): Promise<JobsType> {
        const response = await fetch(`${API_URL}/api/v1/jobs?page=${page}&limit=${limit}&state=${state}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as JobsType;
    }
}
