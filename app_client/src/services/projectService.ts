import { ProjectType, ProjectsType } from "../types/projectType";
import TokenService from "./tokenService";

const API_URL = "http://localhost:3001/api/v1";

export default class UserProductService {
    static async get(_id: string): Promise<ProjectType> {
        const response = await fetch(`${API_URL}/project/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProjectType;
    }

    static async getAll(page: number, limit: number): Promise<ProjectsType> {
        const response = await fetch(`${API_URL}/projects?page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProjectsType;
    }

    static async create(body: { title: string }): Promise<ProjectType> {
        const response = await fetch(`${API_URL}/project`, {
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

        return json.data as ProjectType;
    }

    static async update(_id: string, body: { title: string }): Promise<ProjectType> {
        const response = await fetch(`${API_URL}/project/${_id}`, {
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

        return json.data as ProjectType;
    }

    static async destroy(_id: string): Promise<void> {
        const response = await fetch(`${API_URL}/project/${_id}`, {
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
