
export default {
    pageResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            content: {
                type: 'string'
            },
            category: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
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
    pagesResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        },
                        content: {
                            type: 'string'
                        },
                        category: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string'
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
    orderedPagesResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        category_name: {
                            type: 'string'
                        },
                        pages: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    name: {
                                        type: 'string'
                                    },
                                    content: {
                                        type: 'string'
                                    },
                                    category: {
                                        type: 'object',
                                        properties: {
                                            name: {
                                                type: 'string'
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
    },
};
