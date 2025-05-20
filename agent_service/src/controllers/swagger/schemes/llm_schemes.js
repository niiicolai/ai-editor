
export default {
    llmMesageResponse: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                description: 'Message content'
            },
        }
    },
    llmMesageCreateInput: {
        type: 'object',
        properties: {
            event: {
                type: 'string',
                description: 'Message event'
            },
            messages: {
                type: 'array',
                description: 'List of messages',
                items: {
                    type: 'object',
                    properties: {
                        role: {
                            type: 'string'
                        },
                        content: {
                            type: 'string'
                        },
                    },
                },
            },
        }
    },
};
