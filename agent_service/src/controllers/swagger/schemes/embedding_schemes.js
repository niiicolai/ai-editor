export default {
  embeddingsResponse: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "id",
        },
        embeddings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              chunk: {
                type: "string",
              },
              embedding: {
                type: "array",
                items: {
                  type: "number",
                },
              },
            },
          },
        },
      },
    },
  },
  embeddingCreateInput: {
    type: "object",
    properties: {
      model: {
        type: "string",
        description: "model",
      },
      chunkSize: {
        type: "string",
        description: "chunkSize",
      },
      filesToEmbedding: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "id",
            },
            content: {
              type: "string",
              description: "content",
            },
          },
        },
      },
    },
  },
};
