import { ProjectIndexItemType, ProjectIndexItemsType, ProjectIndexItemCreateType } from "../types/projectIndexItemType";
import TokenService from "./tokenService";

const API_URL = import.meta.env.VITE_AGENT_API;
if (!API_URL) console.error('CONFIGURATION ERROR(projectIndexItemService.ts): VITE_AGENT_API should be set in the .env file');

export default class ProjectIndexItemService {
    static async get(_id: string): Promise<ProjectIndexItemType> {
        const response = await fetch(`${API_URL}/api/v1/project_index_item/${_id}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return json.data as ProjectIndexItemType;
    }

    static async getAll(page: number, limit: number, projectIndexId: string): Promise<ProjectIndexItemsType> {
        const response = await fetch(`${API_URL}/api/v1/project_index_items?projectIndexId=${projectIndexId}&page=${page}&limit=${limit}`, {
            headers: {
                'authorization': `Bearer ${TokenService.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();

        return {
            items: json.data.items,
            pages: json.data.pages,
            total: json.data.total,
            page: json.data.page,
            limit: json.data.limit
        } as ProjectIndexItemsType;
    }

    static async create(body: ProjectIndexItemCreateType): Promise<ProjectIndexItemType> {
        const response = await fetch(`${API_URL}/api/v1/project_index_item`, {
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

        return json.data as ProjectIndexItemType;
    }

    static async destroy(_id: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/v1/project_index_item/${_id}`, {
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
