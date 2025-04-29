import mongoose from 'mongoose';

import { userAgentSessionMessageClientFunctionSchema } from '../sub_documents/user_agent_session_message_client_function_model.js';

const userAgentSessionMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: false
    },
    clientFn: {
        type: userAgentSessionMessageClientFunctionSchema,
        required: false
    },
    markdown: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'assistant', 'system']
    },
    user_files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserFile',
        required: false
    }],
    user_agent_session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAgentSession',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('UserAgentSessionMessage', userAgentSessionMessageSchema);