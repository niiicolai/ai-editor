
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
    productCreateInput: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            category: {
                type: 'string',
            },
            noOfCredits: {
                type: 'number',
            },
            price: {
                type: 'number',
            },
            stripePriceId: {
                type: 'string',
            },
        }
    },
    productUpdateInput: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            category: {
                type: 'string',
            },
            noOfCredits: {
                type: 'number',
            },
            price: {
                type: 'number',
            },
            stripePriceId: {
                type: 'string',
            },
        }
    }
};
