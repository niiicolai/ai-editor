export interface ProjectType {
    _id: string;
    title: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectsType {
    projects: ProjectType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
