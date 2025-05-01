export interface AvailableLlmType {
    _id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface AvailableLlmsType {
    llms: AvailableLlmType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
