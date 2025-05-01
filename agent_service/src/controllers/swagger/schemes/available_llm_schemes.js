
export default {
    availableLlmResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            name: {
                type: 'string',
                description: 'Available LLM name'
            },
            description: {
                type: 'string',
                description: 'Available LLM description'
            },
            created_at: {
                type: 'string'
            },
            updated_at: {
                type: 'string'
            }
        }
    },
    availableLlmsResponse: {
        type: 'object',
        properties: {
            llms: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string',
                            description: 'Available LLM name'
                        },
                        description: {
                            type: 'string',
                            description: 'Available LLM description'
                        },
                        created_at: {
                            type: 'string'
                        },
                        updated_at: {
                            type: 'string'
                        }
                    }
                }
            },
            pages: {
                type: 'integer',
                description: 'Total number of pages'
            },
            total: {
                type: 'integer',
                description: 'Total number of items'
            },
            page: {
                type: 'integer',
                description: 'Current page number'
            },
            limit: {
                type: 'integer',
                description: 'Number of items per page'
            },
        }
    },
};
