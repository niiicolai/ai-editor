import mongoose from 'mongoose';

export const userLoginSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['password'],
        default: 'password'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
