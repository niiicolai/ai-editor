
export default {
    userResponse: {
        type: 'object',
        properties: {
            _id: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            username: {
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
    userTokenResponse: {
        type: 'string',
        description: 'JWT token for authentication'
    },
    userCreateInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                description: 'User email address'
            },
            username: {
                type: 'string',
                description: 'User username'
            },
            password: {
                type: 'string',
                description: 'User password'
            }
        }
    },
    userUpdateInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                description: 'User email address'
            },
            username: {
                type: 'string',
                description: 'User username'
            },
            password: {
                type: 'string',
                description: 'User password'
            }
        }
    },
    userLoginInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                description: 'User email address'
            },
            password: {
                type: 'string',
                description: 'User password'
            }
        }
    },
};
