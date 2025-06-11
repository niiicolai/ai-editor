import mongoose from 'mongoose';

const transactionModelSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['pending', 'completed', 'error'],
        required: true
    },
    error: {
        type: String,
        required: false
    },
    parameters: {
        type: Object,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('Transaction', transactionModelSchema);
