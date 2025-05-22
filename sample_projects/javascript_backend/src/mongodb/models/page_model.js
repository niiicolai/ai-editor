import mongoose from 'mongoose';

export const pageSchema = new mongoose.Schema({
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

export default mongoose.model('Page', pageSchema);
