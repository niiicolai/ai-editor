import TokenService from "./tokenService";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API;
if (!AUTH_API_URL) console.error('CONFIGURATION ERROR(agentJobService.ts): VITE_AUTH_API should be set in the .env file');

export default class UserPasswordResetService {
    static async create(body: { email: string }): Promise<{
            expired_at: string;
            created_at: string;
            updated_at: string;
        }> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user_password_reset`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data;
    }

    static async update(body: { _id: string, password: string }): Promise<{
            expired_at: string;
            created_at: string;
            updated_at: string;
        }> {
        const response = await fetch(`${AUTH_API_URL}/api/v1/user_password_reset/${body._id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${TokenService.getToken()}`
            },
            body: JSON.stringify({ password: body.password })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data;
    }
}
