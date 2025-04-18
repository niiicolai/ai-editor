
export default {
    userAgentSessionResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            title: {
                type: 'string'
            },
            user: {
                type: 'string'
            },
            created_at: {
                type: 'string'
            },
            updated_at: {
                type: 'string'
            }
        }
    },
    userAgentSessionsResponse: {
        type: 'object',
        properties: {
            files: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        user: {
                            type: 'string'
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
    userAgentSessionCreateInput: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'User agent title'
            },
        }
    },
    userAgentSessionUpdateInput: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'User agent title'
            },
        }
    },
};
