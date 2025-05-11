import mongoose from "mongoose";

export const llmUsageSchema = new mongoose.Schema(
  {
    llm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AvailableLlm",
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prompt_tokens: {
      type: Number,
      required: true,
    },
    completion_tokens: {
      type: Number,
      required: true,
    },
    total_tokens: {
      type: Number,
      required: true,
    },
    total_cost_in_dollars: {
      type: Number,
      required: true,
    },
    credit_cost: {
      type: Number,
      required: true,
    },
    credit_to_dollars_at_purchase: {
      type: Number,
      required: true,
    },
    cost_per_input_token_at_purchase: {
      type: Number,
      required: true,
    },
    cost_per_output_token_at_purchase: {
      type: Number,
      required: true,
    },
    fee_per_input_token_at_purchase: {
      type: Number,
      required: true,
    },
    fee_per_output_token_at_purchase: {
      type: Number,
      required: true,
    },
    cost_per_cached_input_token_at_purchase: {
      type: Number,
      required: true,
    },
    user_agent_session_messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAgentSessionMessage",
      required: true,
    }],
    context_user_agent_session_messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAgentSessionMessage",
      required: true,
    }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model("LlmUsage", llmUsageSchema);
