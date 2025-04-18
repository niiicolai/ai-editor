
export default {
    userAgentSessionMessageResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            content: {
                type: 'string',
                description: 'Message content'
            },
            role: {
                type: 'string',
                description: 'Role of the user who sent the message'
            },
            user_files: {
                type: 'array',
                description: 'List of user files associated with the message',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
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
    userAgentSessionMessagesResponse: {
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
                        content: {
                            type: 'string',
                            description: 'Message content'
                        },
                        role: {
                            type: 'string',
                            description: 'Role of the user who sent the message'
                        },
                        user_files: {
                            type: 'array',
                            description: 'List of user files associated with the message',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: {
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
    userAgentSessionMessageCreateInput: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                description: 'Message content'
            },
            user_files: {
                type: 'array',
                description: 'List of user files associated with the message',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                    },
                },
            },
            userAgentSessionId: {
                type: 'string',
                description: 'User agent session ID'
            },
        }
    },
    userAgentSessionMessageUpdateInput: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                description: 'Message content'
            },
        }
    },
};
