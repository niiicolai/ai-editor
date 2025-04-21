import mongoose from 'mongoose';

export const userAgentSessionMessageClientFunctionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    args: {
        type: String,
        required: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
