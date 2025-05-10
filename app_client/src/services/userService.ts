import { UserType } from "../types/userType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3000/api/v1";
const API2_URL = "http://localhost:3001/api/v1";

export default class UserService {
    static async isAuthorized(): Promise<boolean> {
        const response = await fetch(`${API_URL}/user?fields=_id`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        const code = response.status;
        const isNotAuthorized = (code === 401 || code === 403);

        return !isNotAuthorized;
    }

    static async creditLeft(): Promise<{ _id: string, credit: number }> {
        const response = await fetch(`${API2_URL}/user?fields=credit`, {
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
        const response = await fetch(`${API_URL}/user`, {
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
        const response = await fetch(`${API_URL}/user/login`, {
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
        const response = await fetch(`${API_URL}/user`, {
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

    static async update(username: string, email: string, password: string): Promise<UserType> {
        const response = await fetch(`${API_URL}/user`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'authorization': `Bearer ${TokenService.getToken()}`
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

        return json.data as UserType;
    }

    static async destroy(): Promise<void> {
        const response = await fetch(`${API_URL}/user`, {
            method: "DELETE",
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }
    }
}
