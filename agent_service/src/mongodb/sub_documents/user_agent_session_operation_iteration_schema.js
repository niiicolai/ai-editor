import mongoose from 'mongoose';

export const userAgentSessionOperationIterationSchema = new mongoose.Schema({
    user_agent_session_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAgentSessionMessage',
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
