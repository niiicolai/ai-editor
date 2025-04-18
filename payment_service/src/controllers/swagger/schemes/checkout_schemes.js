
export default {
    checkoutResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            user: {
                type: 'string'
            },
            state: {
                type: 'string'
            },
            prices: {
                type: 'array',
                properties: {
                    priceId: { type: 'string' },
                    quantity: { type: 'number' }
                }
            },
            created_at: {
                type: 'string'
            },
            updated_at: {
                type: 'string'
            }
        }
    },
    checkoutsResponse: {
        type: 'object',
        properties: {
            checkouts: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        user: {
                            type: 'string'
                        },
                        state: {
                            type: 'string'
                        },
                        prices: {
                            type: 'array',
                            items: [{
                                priceId: { type: 'string' },
                                quantity: { type: 'number' }
                            }]
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
    checkoutCreateInput: {
        type: 'object',
        properties: {
            prices: {
                type: 'array',
                properties: {
                    priceId: { type: 'string' },
                    quantity: { type: 'number' }
                }
            },
        }
    },
    checkoutUpdateInput: {
        type: 'object',
        properties: {
            prices: {
                type: 'array',
                properties: {
                    priceId: { type: 'string' },
                    quantity: { type: 'number' }
                }
            },
        }
    }
};
