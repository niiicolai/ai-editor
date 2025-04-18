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

        return json.data as UserAgentSessionMessagesType;
    }
}
