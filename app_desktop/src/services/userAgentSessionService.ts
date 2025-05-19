import { UserAgentSessionType, UserAgentSessionsType } from "../types/userAgentSessionType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_AGENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(userAgentSessionService.ts): VITE_AGENT_API should be set in the .env file');

export default class UserAgentSessionService {
    static async get(_id: string): Promise<UserAgentSessionType> {
        const response = await fetch(`${API_URL}/api/v1/user_agent_session/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionType;
    }

    static async getAll(page: number, limit: number): Promise<UserAgentSessionsType> {
        const response = await fetch(`${API_URL}/api/v1/user_agent_sessions?page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionsType;
    }

    static async create(body: { title: string }): Promise<UserAgentSessionType> {
        const response = await fetch(`${API_URL}/api/v1/user_agent_session`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionType;
    }

    static async update(_id: string, body: { title: string }): Promise<UserAgentSessionType> {
        const response = await fetch(`${API_URL}/api/v1/user_agent_session/${_id}`, {
            method: 'PATCH',
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionType;
    }

    static async destroy(_id: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/v1/user_agent_session/${_id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }
    }
}
