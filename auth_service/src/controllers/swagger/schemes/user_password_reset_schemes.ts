
export default {
    userPasswordResetResponse: {
        type: 'object',
        properties: {
            expired_at: {
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
    userPasswordResetCreateInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                description: 'User email address'
            },
        }
    },
    userPasswordResetUpdateInput: {
        type: 'object',
        properties: {
            password: {
                type: 'string',
                description: 'User password'
            }
        }
    },
};
