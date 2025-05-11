import mongoose from 'mongoose';

const availableLlmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost_per_input_token: {
        type: Number,
        required: true
    },
    cost_per_output_token: {
        type: Number,
        required: true
    },
    cost_per_cached_input_token: {
        type: Number,
        required: true
    },
    fee_per_input_token: {
        type: Number,
        required: true
    },
    fee_per_output_token: {
        type: Number,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('AvailableLlm', availableLlmSchema);
