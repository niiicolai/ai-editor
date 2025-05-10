export interface JobType {
    _id: string;
    type: string;
    state: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface JobsType {
    jobs: JobType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
