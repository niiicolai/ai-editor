export default (doc) => {
  return {
    _id: doc._id,
    llm: doc.llm,
    event: doc.event,
    user_agent_session_messages: doc.user_agent_session_messages,
    context_user_agent_session_messages: doc.context_user_agent_session_messages,
    prompt_tokens: doc.prompt_tokens,
    completion_tokens: doc.completion_tokens,
    total_tokens: doc.total_tokens,
    credit_cost: doc.credit_cost,
    total_cost_in_dollars: doc.total_cost_in_dollars,
    credit_to_dollars_at_purchase: doc.credit_to_dollars_at_purchase,
    cost_per_input_token_at_purchase: doc.cost_per_input_token_at_purchase,
    cost_per_output_token_at_purchase: doc.cost_per_output_token_at_purchase,
    fee_per_input_token_at_purchase: doc.fee_per_input_token_at_purchase,
    fee_per_output_token_at_purchase: doc.fee_per_output_token_at_purchase,
    cost_per_cached_input_token_at_purchase: doc.cost_per_cached_input_token_at_purchase,
    user: doc.user,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  };
};
