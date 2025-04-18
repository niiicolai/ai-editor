import mongoose from 'mongoose';

const userFileSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cv', 'cover_letter', 'portfolio', 'other']
    },
    mimetype: {
        type: String,
        required: true
    },
    bytes: {
        type: Number,
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

export default mongoose.model('UserFile', userFileSchema);