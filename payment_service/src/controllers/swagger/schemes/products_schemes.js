
export default {
    productResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            title: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            noOfCredits: {
                type: 'number'
            },
            created_at: {
                type: 'string'
            },
            updated_at: {
                type: 'string'
            }
        }
    },
    productsResponse: {
        type: 'object',
        properties: {
            products: {
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
                        description: {
                            type: 'string'
                        },
                        noOfCredits: {
                            type: 'number'
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
