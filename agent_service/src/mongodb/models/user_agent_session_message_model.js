import mongoose from 'mongoose';

const userAgentSessionMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    code: {
        type: String,
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
    state: {
        type: String,
        required: true,
        enum: ['pending', 'read', 'completed', 'error'],
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