import { UserAgentSessionMessageType } from "./userAgentSessionMessageType";

export interface LlmUsageType {
    _id: string;
    event: string;
    llm: {
        name: string;
        cost_per_input_token: number;
        cost_per_output_token: number;
        fee_per_input_token: number;
        fee_per_output_token: number;
    };
    total_cost_in_dollars: number;
    credit_to_dollars_at_purchase: number;
    cost_per_input_token_at_purchase: number;
    cost_per_output_token_at_purchase: number;
    fee_per_input_token_at_purchase: number;
    fee_per_output_token_at_purchase: number;
    cost_per_cached_input_token_at_purchase: number;
    user_agent_session_messages: [UserAgentSessionMessageType];
    context_user_agent_session_messages: [UserAgentSessionMessageType];
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    credit_cost: number;
    created_at: string;
    updated_at: string;
}

export interface LlmUsagesType {
    usages: LlmUsageType[];
    total: number;
    pages: number;
    limit: number;
    page: number;
}
