
export default {
    linksResponse: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                rel: {
                    type: 'string',
                    description: 'Relation type'
                },
                href: {
                    type: 'string',
                    description: 'Resource URL'
                },
                method: {
                    type: 'string',
                    description: 'HTTP method'
                }
            }
        },
    },
};
