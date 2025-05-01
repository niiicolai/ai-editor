export interface ProjectIndexType {
    _id: string;
    name: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectIndexesType {
    projects: ProjectIndexType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
