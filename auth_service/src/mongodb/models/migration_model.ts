import mongoose from 'mongoose';

export const migrationSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    },
    order: {
        type: Number,
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export default mongoose.model('Migration', migrationSchema);
