import mongoose from 'mongoose';

export const jobSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'error'],
        default: 'pending',
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('Job', jobSchema);
