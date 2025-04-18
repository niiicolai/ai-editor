import { UserAgentSessionMessageType, UserAgentSessionMessagesType } from "../types/userAgentSessionMessageType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3001/api/v1";

export default class UserAgentSessionMessagesService {
    static async get(_id: string): Promise<UserAgentSessionMessageType> {
        const response = await fetch(`${API_URL}/user_agent_session_message/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserAgentSessionMessageType;
    }

    static async getAll(page: number, limit: number, user_agent_session_id: string): Promise<UserAgentSessionMessagesType> {
        const response = await fetch(`${API_URL}/user_agent_session_messages?page=${page}&limit=${limit}&user_agent_session_id=${user_agent_session_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return {
            messages: json.data.messages?.reverse(),
            pages: json.data.pages,
            total: json.data.total,
            page: json.data.page,
            limit: json.data.limit
        } as UserAgentSessionMessagesType;
    }

    static async create(body: { content: string, userAgentSessionId: string, currentFile: { name: string, content: string}, directoryInfo: any }): Promise<UserAgentSessionMessageType> {
        const response = await fetch(`${API_URL}/user_agent_session_message`, {
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

        return json.data as UserAgentSessionMessageType;
    }

    static async update(_id: string, body: { content: string }): Promise<UserAgentSessionMessageType> {
        const response = await fetch(`${API_URL}/user_agent_session_message/${_id}`, {
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

        return json.data as UserAgentSessionMessageType;
    }

    static async destroy(_id: string): Promise<void> {
        const response = await fetch(`${API_URL}/user_agent_session_message/${_id}`, {
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
