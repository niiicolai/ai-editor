
export default {
    userAgentSessionOperationResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            name: {
                type: 'string',
                description: 'Operation name'
            },
            max_iterations: {
                type: 'number',
                description: 'Max iterations'
            },
            state: {
                type: 'string',
                description: 'Current state'
            },
            iterations: {
                type: 'array',
                description: 'List of operation iterations',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        user_agent_session_message: {
                            type: 'string'
                        },
                    },
                },
            },
            user_agent_session: {
                type: 'string',
                description: 'User agent session ID'
            },
            user: {
                type: 'string',
                description: 'User ID'
            },
            created_at: {
                type: 'string'
            },
            updated_at: {
                type: 'string'
            }
        }
    },
    userAgentSessionOperationsResponse: {
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
                        name: {
                            type: 'string',
                            description: 'Operation name'
                        },
                        max_iterations: {
                            type: 'number',
                            description: 'Max iterations'
                        },
                        state: {
                            type: 'string',
                            description: 'Current state'
                        },
                        iterations: {
                            type: 'array',
                            description: 'List of operation iterations',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    user_agent_session_message: {
                                        type: 'string'
                                    },
                                },
                            },
                        },
                        user_agent_session: {
                            type: 'string',
                            description: 'User agent session ID'
                        },
                        user: {
                            type: 'string',
                            description: 'User ID'
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
