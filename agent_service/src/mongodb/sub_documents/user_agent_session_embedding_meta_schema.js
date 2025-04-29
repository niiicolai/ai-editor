import mongoose from 'mongoose';

export const userAgentSessionEmbeddingMetaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: false
    },
    filepath: {
        type: String,
        required: false
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
