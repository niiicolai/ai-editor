export interface UserAgentSessionMessageType {
    _id: string;
    content: string;
    role: string;
    user_files: {
        _id: string;
    };
    user_agent_session: string;
    user: string;
    created_at: string;
    updated_at: string;
}

export interface UserAgentSessionMessagesType {
    sessions: UserAgentSessionMessageType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
