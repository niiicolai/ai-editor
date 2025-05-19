import { UserType } from "../types/userType";
import TokenService from "./tokenService";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
if (!AUTH_API_URL) console.error('CONFIGURATION ERROR(userService.ts): VITE_AUTH_API should be set in the .env file');

const AGENT_API_URL = import.meta.env.VITE_AGENT_API;
if (!AGENT_API_URL) console.error('CONFIGURATION ERROR(userService.ts): VITE_AGENT_API should be set in the .env file');

export default class UserService {
    static async isAuthorized(): Promise<boolean> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user?fields=_id`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        const code = response.status;
        const isNotAuthorized = (code === 401 || code === 403);

        return !isNotAuthorized;
    }

    static async creditLeft(): Promise<{ _id: string, credit: number }> {
        const response = await fetch(`${AGENT_API_URL}/api/v1/user?fields=credit`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as { _id: string, credit: number };
    }

    static async get(): Promise<UserType> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as UserType;
    }

    static async login(email: string, password: string): Promise<void> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        TokenService.setToken(json.data.token as string);
    }

    static async create(username: string, email: string, password: string): Promise<void> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        TokenService.setToken(json.data.token as string);
    }
}
