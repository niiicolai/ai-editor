import mongoose from 'mongoose';

export const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('Todo', todoSchema);
