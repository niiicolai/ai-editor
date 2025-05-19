import mongoose from 'mongoose';

export const userTwoFactorSchema = new mongoose.Schema({
    secret: {
        type: String,
        required: true
    },
    is_enabled: {
        type: Boolean,
        default: false
    },
    uri: {
        type: String,
        required: true
    },
    recovery_codes: [{
        type: String,
        required: true
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
