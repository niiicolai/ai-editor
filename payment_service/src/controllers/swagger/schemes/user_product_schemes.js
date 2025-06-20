
export default {
    userProductResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            user: {
                type: 'string'
            },
            expires_at: {
                type: 'string'
            },
            credit: {
                type: 'object',
                properties: {
                    noOfCredits: {
                        type: 'number'
                    },
                    usedCredits: {
                        type: 'number'
                    },
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
    userProductsResponse: {
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
                        user: {
                            type: 'string'
                        },
                        expires_at: {
                            type: 'string'
                        },
                        credit: {
                            type: 'object',
                            properties: {
                                numberOfCredits: {
                                    type: 'number'
                                },
                                usedCredits: {
                                    type: 'number'
                                },
                            }
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
