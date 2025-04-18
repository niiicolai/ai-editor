import { UserAgentSessionType, UserAgentSessionsType } from "../types/userAgentSessionType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3001/api/v1";

export default class UserAgentSessionService {
    static async get(_id: string): Promise<UserAgentSessionType> {
        const response = await fetch(`${API_URL}/user_agent_session/${_id}`, {
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
        const response = await fetch(`${API_URL}/user_agent_sessions?page=${page}&limit=${limit}`, {
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

    static async create(data: { title: string }): Promise<UserAgentSessionType> {
        const response = await fetch(`${API_URL}/user_agent_session`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionType;
    }
}
