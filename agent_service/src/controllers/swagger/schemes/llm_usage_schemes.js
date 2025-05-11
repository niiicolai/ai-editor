export default {
  llmUsageResponse: {
    type: "object",
    properties: {
      _id: {
        type: "string",
      },
      llm: {
        type: "string",
        description: "llm",
      },
      prompt_tokens: {
        type: "number",
        description: "prompt_tokens",
      },
      completion_tokens: {
        type: "number",
        description: "completion_tokens",
      },
      total_tokens: {
        type: "number",
        description: "total_tokens",
      },
      credit_cost: {
        type: "number",
        description: "number",
      },
      user: {
        type: "string",
        description: "User ID",
      },
      created_at: {
        type: "string",
      },
      updated_at: {
        type: "string",
      },
    },
  },
  llmUsagesResponse: {
    type: "object",
    properties: {
      items: {
        type: "array",
        usages: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            llm: {
              type: "string",
              description: "llm",
            },
            prompt_tokens: {
              type: "number",
              description: "prompt_tokens",
            },
            completion_tokens: {
              type: "number",
              description: "completion_tokens",
            },
            total_tokens: {
              type: "number",
              description: "total_tokens",
            },
            total_cost_in_dollars: {
              type: "number",
              description: "total_cost_in_dollars",
            },
            credit_to_dollars_at_purchase: {
              type: "number",
              description: "credit_to_dollars_at_purchase",
            },
            credit_cost: {
              type: "number",
              description: "number",
            },
            user: {
              type: "string",
              description: "User ID",
            },
            created_at: {
              type: "string",
            },
            updated_at: {
              type: "string",
            },
          },
        },
      },
      pages: {
        type: "integer",
        description: "Total number of pages",
      },
      total: {
        type: "integer",
        description: "Total number of items",
      },
      page: {
        type: "integer",
        description: "Current page number",
      },
      limit: {
        type: "integer",
        description: "Number of items per page",
      },
    },
  },
};
