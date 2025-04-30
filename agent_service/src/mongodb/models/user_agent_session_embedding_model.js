import mongoose from 'mongoose';

import { userAgentSessionEmbeddingMetaSchema } from '../sub_documents/user_agent_session_embedding_meta_schema.js';

const userAgentSessionEmbeddingSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    },
    meta: {
        type: userAgentSessionEmbeddingMetaSchema,
        required: true
    },
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

export default mongoose.model('UserAgentSessionEmbedding', userAgentSessionEmbeddingSchema);