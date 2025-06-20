import { ProjectIndexType, ProjectIndexesType } from "../types/projectIndexBackendType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_AGENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(projectIndexService.ts): VITE_AGENT_API should be set in the .env file');

export default class ProjectIndexService {
    static async get(_id: string): Promise<ProjectIndexType> {
        const response = await fetch(`${API_URL}/api/v1/project_index/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProjectIndexType;
    }

    static async getByName(name: string): Promise<ProjectIndexType> {
        const response = await fetch(`${API_URL}/api/v1/project_index_by_name/${name}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProjectIndexType;
    }

    static async existByName(name: string): Promise<{ exist: boolean; }> {
        const response = await fetch(`${API_URL}/api/v1/project_index_exist_by_name/${name.replace(/\\|:/g, '')}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as { exist: boolean; };
    }

    static async getAll(page: number, limit: number): Promise<ProjectIndexesType> {
        const response = await fetch(`${API_URL}/api/v1/project_indexes?page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return {
            projects: json.data.projects,
            pages: json.data.pages,
            total: json.data.total,
            page: json.data.page,
            limit: json.data.limit
        } as ProjectIndexesType;
    }

    static async create(body: { name: string }): Promise<ProjectIndexType> {
        const response = await fetch(`${API_URL}/api/v1/project_index`, {
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

        return json.data as ProjectIndexType;
    }

    static async destroy(_id: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/v1/project_index/${_id}`, {
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
