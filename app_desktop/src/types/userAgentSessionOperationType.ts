export interface UserAgentSessionOperationType {
    _id: string;
    name: string;
    max_iterations: string;
    state: string;
    iterations: {
        _id: string;
        user_agent_session_message: string;
        created_at: string;
        updated_at: string;
    }[];
    user_agent_session: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface UserAgentSessionOperationsType {
    operations: UserAgentSessionOperationType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}