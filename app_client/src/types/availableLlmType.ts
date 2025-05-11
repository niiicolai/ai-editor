export interface AvailableLlmType {
    _id: string;
    name: string;
    description: string;
    cost_per_input_token: number;
    cost_per_output_token: number;
    cost_per_cached_input_token: number;
    fee_per_input_token: number;
    fee_per_output_token: number;
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
