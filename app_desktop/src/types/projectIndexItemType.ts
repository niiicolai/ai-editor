export interface ProjectIndexItemType {
    _id: string;
    name: string;
    description: string;
    hashCode: string;
    lines: number;
    language: string;
    project_index: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectIndexItemsType {
    items: ProjectIndexItemType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}

export interface ProjectIndexItemCreateType {
    name: string;
    path: string;
    description: string;
    hashCode: string;
    lines: number;
    language: string;
    content: string;
    functions: string;
    classes: string;
    vars: string;
    projectIndexId: string;
}
