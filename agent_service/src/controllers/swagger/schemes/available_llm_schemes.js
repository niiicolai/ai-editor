
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
            cost_per_input_token: {
                type: 'number',
                description: 'cost_per_input_token'
            },
            cost_per_output_token: {
                type: 'number',
                description: 'cost_per_output_token'
            },
            cost_per_cached_input_token: {
                type: 'number',
                description: 'cost_per_cached_input_token'
            },
            fee_per_input_token: {
                type: 'number',
                description: 'fee_per_input_token'
            },
            fee_per_output_token: {
                type: 'number',
                description: 'fee_per_output_token'
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
