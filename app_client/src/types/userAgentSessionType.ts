export interface UserAgentSessionType {
    _id: string;
    title: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface UserAgentSessionsType {
    sessions: UserAgentSessionType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
