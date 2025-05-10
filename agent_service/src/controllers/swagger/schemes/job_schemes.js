export default {
  jobResponse: {
    type: "object",
    properties: {
      _id: {
        type: "string",
      },
      type: {
        type: "string",
      },
      state: {
        type: "string",
      },
      message: {
        type: "string",
      },
      created_at: {
        type: "string",
      },
      updated_at: {
        type: "string",
      },
    },
  },
  jobsResponse: {
    type: "object",
    properties: {
      jobs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            type: {
              type: "string",
            },
            state: {
              type: "string",
            },
            message: {
              type: "string",
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
