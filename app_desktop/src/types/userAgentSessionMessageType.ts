export interface UserAgentSessionMessageType {
    _id: string;
    content: string;
    code: string;
    clientFn: {
        name: string;
        args: string;
    }
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
    messages: UserAgentSessionMessageType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
