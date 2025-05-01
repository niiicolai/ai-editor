export default {
  userAgentSessionMessageResponse: {
    type: "object",
    properties: {
      _id: {
        type: "string",
      },
      name: {
        type: "string",
        description: "project index name",
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
  projectIndexesResponse: {
    type: "object",
    properties: {
      projects: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              description: "project index name",
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
  projectIndexCreateInput: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "project index name",
      },
    },
  },
};
