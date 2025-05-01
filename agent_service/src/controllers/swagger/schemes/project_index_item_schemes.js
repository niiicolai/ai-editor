export default {
  projectIndexItemResponse: {
    type: "object",
    properties: {
      _id: {
        type: "string",
      },
      name: {
        type: "string",
        description: "project index item name",
      },
      description: {
        type: "string",
        description: "project index item description",
      },
      hashCode: {
        type: "string",
        description: "project index item hashCode",
      },
      lines: {
        type: "number",
        description: "project index item lines",
      },
      language: {
        type: "string",
        description: "project index item language",
      },
      project_index: {
        type: "string",
        description: "project index item project_index",
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
  projectIndexItemsResponse: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              description: "project index item name",
            },
            description: {
              type: "string",
              description: "project index item description",
            },
            hashCode: {
              type: "string",
              description: "project index item hashCode",
            },
            lines: {
              type: "number",
              description: "project index item lines",
            },
            language: {
              type: "string",
              description: "project index item language",
            },
            project_index: {
              type: "string",
              description: "project index item project_index",
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
  projectIndexItemCreateInput: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "project index item name",
      },
      path: {
        type: "string",
        description: "project index item path",
      },
      description: {
        type: "string",
        description: "project index item description",
      },
      hashCode: {
        type: "string",
        description: "project index item hashCode",
      },
      lines: {
        type: "number",
        description: "project index item lines",
      },
      language: {
        type: "string",
        description: "project index item language",
      },
      functions: {
        type: "string",
        description: "project index item functions",
      },
      classes: {
        type: "string",
        description: "project index item classes",
      },
      vars: {
        type: "string",
        description: "project index item vars",
      },
    },
  },
};
